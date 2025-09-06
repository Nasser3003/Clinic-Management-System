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
        validateSystemRoleModification(role);
        
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
        validateSystemRoleModification(role);
        
        Set<PermissionEnum> oldPermissions = role.getPermissions();
        role.setPermissions(permissions);
        
        RoleEntity savedRole = roleRepository.save(role);
        log.info("Updated role {} permissions: {} -> {}", 
                role.getName(), oldPermissions.size(), permissions.size());
        
        return savedRole;
    }

    @Transactional
    public RoleEntity addPermission(Long roleId, PermissionEnum permission) {
        RoleEntity role = getRoleById(roleId);
        validateSystemRoleModification(role);
        
        if (role.hasPermission(permission)) {
            log.warn("Permission {} already exists in role {}", permission, role.getName());
            return role;
        }
        
        role.addPermission(permission);
        RoleEntity savedRole = roleRepository.save(role);
        log.info("Added permission {} to role {}", permission, role.getName());
        
        return savedRole;
    }

    @Transactional
    public RoleEntity removePermission(Long roleId, PermissionEnum permission) {
        RoleEntity role = getRoleById(roleId);
        validateSystemRoleModification(role);
        
        if (!role.hasPermission(permission)) {
            log.warn("Permission {} does not exist in role {}", permission, role.getName());
            return role;
        }
        
        role.removePermission(permission);
        RoleEntity savedRole = roleRepository.save(role);
        log.info("Removed permission {} from role {}", permission, role.getName());
        
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
        
        if (Boolean.TRUE.equals(role.getSystemRole())) {
            throw new IllegalArgumentException("Cannot delete system role: " + role.getName());
        }
        
        // TODO: Check if role is assigned to any users
        // You might want to prevent deletion or reassign users
        
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

    private RoleEntity getRoleById(Long roleId) {
        return roleRepository.findById(roleId)
            .orElseThrow(() -> new IllegalArgumentException("Role not found with id: " + roleId));
    }

    private void validateSystemRoleModification(RoleEntity role) {
        if (Boolean.TRUE.equals(role.getSystemRole())) {
            throw new IllegalArgumentException("Cannot modify system role: " + role.getName());
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