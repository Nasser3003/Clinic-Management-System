package com.clinic.demo.service;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class RoleManagementService {

    private final RoleRepository roleRepository;
    private final DefaultPermissionsService defaultPermissionsService;

    @Transactional
    public void initializeSystemRoles() {
        log.info("Initializing system roles...");

        for (UserTypeEnum userType : UserTypeEnum.values()) {
            String roleName = "ROLE_" + userType.name();

            if (!roleRepository.existsByName(roleName)) {
                Set<PermissionEnum> defaultPermissions =
                        defaultPermissionsService.getDefaultPermissionsForUserType(userType);

                RoleEntity role = RoleEntity.builder()
                        .name(roleName)
                        .description("System role for " + userType.getDisplayName())
                        .userType(userType)
                        .permissions(defaultPermissions)
                        .systemRole(true)
                        .active(true)
                        .build();

                roleRepository.save(role);
                log.info("Created system role: {} with {} permissions",
                        roleName, defaultPermissions.size());
            }
        }
    }

    @Transactional
    public RoleEntity createRole(String name, String description, Set<PermissionEnum> permissions) {
        validateRoleName(name);

        if (roleRepository.existsByName(name)) {
            throw new IllegalArgumentException("Role with name '" + name + "' already exists");
        }

        RoleEntity role = RoleEntity.builder()
                .name(name.trim())
                .description(description)
                .permissions(permissions)
                .systemRole(false)
                .active(true)
                .build();

        RoleEntity savedRole = roleRepository.save(role);
        log.info("Created custom role: {} with {} permissions", name, permissions.size());

        return savedRole;
    }

    @Transactional
    public RoleEntity updateRole(Long roleId, String name, String description) {
        RoleEntity role = getRoleById(roleId);
        validateSystemRoleNameModification(role);

        if (name != null && !name.equals(role.getName())) {
            validateRoleName(name);
            if (roleRepository.existsByName(name)) {
                throw new IllegalArgumentException("Role with name '" + name + "' already exists");
            }
            role.setName(name.trim());
        }

        if (description != null) {
            role.setDescription(description);
        }

        RoleEntity savedRole = roleRepository.save(role);
        log.info("Updated role: {}", savedRole.getName());

        return savedRole;
    }

    @Transactional
    public RoleEntity updateRolePermissions(Long roleId, Set<PermissionEnum> permissions) {
        RoleEntity role = getRoleById(roleId);

        // Allow permission modifications for both system and custom roles
        Set<PermissionEnum> oldPermissions = role.getPermissions();
        role.setPermissions(permissions);

        RoleEntity savedRole = roleRepository.save(role);
        log.info("Updated role {} permissions: {} -> {} (System role: {})",
                role.getName(), oldPermissions.size(), permissions.size(), role.getSystemRole());

        return savedRole;
    }

    @Transactional
    public RoleEntity addPermission(Long roleId, PermissionEnum permission) {
        RoleEntity role = getRoleById(roleId);

        if (role.hasPermission(permission)) {
            log.warn("Permission {} already exists in role {}", permission, role.getName());
            return role;
        }

        role.addPermission(permission);
        RoleEntity savedRole = roleRepository.save(role);
        log.info("Added permission {} to role {} (System role: {})",
                permission, role.getName(), role.getSystemRole());

        return savedRole;
    }

    @Transactional
    public RoleEntity removePermission(Long roleId, PermissionEnum permission) {
        RoleEntity role = getRoleById(roleId);

        if (!role.hasPermission(permission)) {
            log.warn("Permission {} does not exist in role {}", permission, role.getName());
            return role;
        }

        // For system roles, warn when removing default permissions
        if (Boolean.TRUE.equals(role.getSystemRole()) && role.getUserType() != null) {
            Set<PermissionEnum> defaultPermissions =
                    defaultPermissionsService.getDefaultPermissionsForUserType(role.getUserType());

            if (defaultPermissions.contains(permission)) {
                log.warn("Removing default permission {} from system role {}",
                        permission, role.getName());
            }
        }

        role.removePermission(permission);
        RoleEntity savedRole = roleRepository.save(role);
        log.info("Removed permission {} from role {} (System role: {})",
                permission, role.getName(), role.getSystemRole());

        return savedRole;
    }

    @Transactional
    public RoleEntity toggleRoleStatus(Long roleId, boolean active) {
        RoleEntity role = getRoleById(roleId);

        if (Boolean.TRUE.equals(role.getSystemRole()) && !active) {
            throw new IllegalArgumentException("Cannot deactivate system role: " + role.getName());
        }

        role.setActive(active);
        RoleEntity savedRole = roleRepository.save(role);
        log.info("{} role: {}", active ? "Activated" : "Deactivated", role.getName());

        return savedRole;
    }

    @Transactional
    public void deleteRole(Long roleId) {
        RoleEntity role = getRoleById(roleId);

        if (Boolean.TRUE.equals(role.getSystemRole()))
            throw new IllegalArgumentException("Cannot delete system role: " + role.getName());

        roleRepository.delete(role);
        log.info("Deleted role: {}", role.getName());
    }

    public Optional<RoleEntity> findByName(String name) {
        return roleRepository.findByName(name);
    }

    public Optional<RoleEntity> findByUserType(UserTypeEnum userType) {
        return roleRepository.findByUserType(userType);
    }

    public List<RoleEntity> findAllActiveRoles() {
        return roleRepository.findByActiveTrue();
    }

    public List<RoleEntity> findCustomRoles() {
        return roleRepository.findBySystemRoleFalse();
    }

    public List<RoleEntity> findSystemRoles() {
        return roleRepository.findBySystemRoleTrue();
    }

    @Transactional
    public RoleEntity resetSystemRoleToDefaults(Long roleId) {
        RoleEntity role = getRoleById(roleId);

        if (!Boolean.TRUE.equals(role.getSystemRole()) || role.getUserType() == null) {
            throw new IllegalArgumentException("Can only reset system roles with defined user types");
        }

        Set<PermissionEnum> defaultPermissions =
                defaultPermissionsService.getDefaultPermissionsForUserType(role.getUserType());

        role.setPermissions(defaultPermissions);
        RoleEntity savedRole = roleRepository.save(role);
        log.info("Reset system role {} to default permissions ({})",
                role.getName(), defaultPermissions.size());

        return savedRole;
    }

    /**
     * Get permissions that have been added beyond the default for a system role
     */
    public Set<PermissionEnum> getCustomPermissions(Long roleId) {
        return getPermissionDifference(roleId, false);
    }

    /**
     * Get default permissions that have been removed from a system role
     */
    public Set<PermissionEnum> getRemovedDefaultPermissions(Long roleId) {
        return getPermissionDifference(roleId, true);
    }

    /**
     * Helper method to get permission differences for system roles
     * @param roleId The role ID
     * @param getRemovedDefaults true to get removed default permissions, false to get custom additions
     */
    private Set<PermissionEnum> getPermissionDifference(Long roleId, boolean getRemovedDefaults) {
        RoleEntity role = getRoleById(roleId);

        if (!Boolean.TRUE.equals(role.getSystemRole()) || role.getUserType() == null) {
            return Set.of();
        }

        Set<PermissionEnum> defaultPermissions =
                defaultPermissionsService.getDefaultPermissionsForUserType(role.getUserType());
        Set<PermissionEnum> currentPermissions = role.getPermissions();

        if (getRemovedDefaults) {
            // Return default permissions that are NOT in current permissions
            return defaultPermissions.stream()
                    .filter(permission -> !currentPermissions.contains(permission))
                    .collect(java.util.stream.Collectors.toSet());
        } else {
            // Return current permissions that are NOT in default permissions
            return currentPermissions.stream()
                    .filter(permission -> !defaultPermissions.contains(permission))
                    .collect(java.util.stream.Collectors.toSet());
        }
    }


    /**
     * Check if a system role has been customized (permissions added or removed)
     */
    public boolean isSystemRoleCustomized(Long roleId) {
        RoleEntity role = getRoleById(roleId);

        if (!Boolean.TRUE.equals(role.getSystemRole()) || role.getUserType() == null) {
            return false;
        }

        Set<PermissionEnum> defaultPermissions =
                defaultPermissionsService.getDefaultPermissionsForUserType(role.getUserType());
        Set<PermissionEnum> currentPermissions = role.getPermissions();

        return !defaultPermissions.equals(currentPermissions);
    }

    private RoleEntity getRoleById(Long roleId) {
        return roleRepository.findById(roleId)
                .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + roleId));
    }

    // Only prevent changing system role names, not permissions
    private void validateSystemRoleNameModification(RoleEntity role) {
        if (Boolean.TRUE.equals(role.getSystemRole())) {
            throw new IllegalArgumentException("Cannot modify system role name: " + role.getName());
        }
    }

    private void validateRoleName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Role name cannot be empty");
        }

        if (name.length() > 50) {
            throw new IllegalArgumentException("Role name cannot exceed 50 characters");
        }
    }
}