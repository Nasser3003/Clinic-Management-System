package com.clinic.demo.service;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.enums.PermissionEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

/**
 * Service for checking permissions across the application.
 * Used by security components and business logic.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

    /**
     * Check if a user has a specific permission
     */
    public boolean hasPermission(BaseUserEntity user, PermissionEnum permission) {
        if (user == null || permission == null) {
            log.debug("User or permission is null - denying access");
            return false;
        }

        return user.getRoles().stream()
                .filter(role -> Boolean.TRUE.equals(role.getActive()))
                .anyMatch(role -> role.hasPermission(permission));
    }

    /**
     * Check if a user has any of the specified permissions
     */
    public boolean hasAnyPermission(BaseUserEntity user, PermissionEnum... permissions) {
        if (user == null || permissions == null || permissions.length == 0) {
            return false;
        }

        for (PermissionEnum permission : permissions) {
            if (hasPermission(user, permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Check if a user has all of the specified permissions
     */
    public boolean hasAllPermissions(BaseUserEntity user, PermissionEnum... permissions) {
        if (user == null || permissions == null || permissions.length == 0) {
            return false;
        }

        for (PermissionEnum permission : permissions) {
            if (!hasPermission(user, permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Get all permissions for a user
     */
    public Set<PermissionEnum> getUserPermissions(BaseUserEntity user) {
        if (user == null) {
            return Set.of();
        }

        return user.getRoles().stream()
                .filter(role -> Boolean.TRUE.equals(role.getActive()))
                .flatMap(role -> role.getPermissions().stream())
                .collect(Collectors.toSet());
    }

    /**
     * Check if a set of roles has a permission
     */
    public boolean rolesHavePermission(Set<RoleEntity> roles, PermissionEnum permission) {
        if (roles == null || permission == null) {
            return false;
        }

        return roles.stream()
                .filter(role -> Boolean.TRUE.equals(role.getActive()))
                .anyMatch(role -> role.hasPermission(permission));
    }

    /**
     * Get all permissions from a set of roles
     */
    public Set<PermissionEnum> getRolePermissions(Set<RoleEntity> roles) {
        if (roles == null) {
            return Set.of();
        }

        return roles.stream()
                .filter(role -> Boolean.TRUE.equals(role.getActive()))
                .flatMap(role -> role.getPermissions().stream())
                .collect(Collectors.toSet());
    }

    /**
     * Check if user can perform admin operations
     */
    public boolean canPerformAdminOperations(BaseUserEntity user) {
        return hasAnyPermission(user, 
            PermissionEnum.ADMIN_SYSTEM_CONFIG, 
            PermissionEnum.ADMIN_USER_MANAGEMENT);
    }

    /**
     * Check if user can manage patients
     */
    public boolean canManagePatients(BaseUserEntity user) {
        return hasAnyPermission(user,
            PermissionEnum.PATIENT_CREATE,
            PermissionEnum.PATIENT_UPDATE,
            PermissionEnum.PATIENT_DELETE);
    }

    /**
     * Check if user can access medical records
     */
    public boolean canAccessMedicalRecords(BaseUserEntity user) {
        return hasAnyPermission(user,
            PermissionEnum.MEDICAL_RECORD_READ,
            PermissionEnum.MEDICAL_RECORD_CREATE,
            PermissionEnum.MEDICAL_RECORD_UPDATE,
            PermissionEnum.MEDICAL_RECORD_READ_OWN);
    }

    /**
     * Check if user can manage appointments
     */
    public boolean canManageAppointments(BaseUserEntity user) {
        return hasAnyPermission(user,
            PermissionEnum.APPOINTMENT_CREATE,
            PermissionEnum.APPOINTMENT_UPDATE,
            PermissionEnum.APPOINTMENT_DELETE);
    }

    /**
     * Check if user can access own data only (patient role check)
     */
    public boolean hasOnlyOwnDataAccess(BaseUserEntity user) {
        Set<PermissionEnum> userPermissions = getUserPermissions(user);
        
        // Check if user only has "own" permissions
        return userPermissions.stream()
                .allMatch(permission -> 
                    permission.getCode().contains(":own") || 
                    permission == PermissionEnum.APPOINTMENT_CREATE ||
                    permission == PermissionEnum.VIEW_TEST_RESULTS);
    }

    /**
     * Validate if user can assign a specific role to another user
     */
    public boolean canAssignRole(BaseUserEntity assigner, RoleEntity roleToAssign) {
        // Only admins can assign roles
        if (!hasPermission(assigner, PermissionEnum.ADMIN_USER_MANAGEMENT)) {
            return false;
        }

        // Additional business rules can be added here
        // For example: certain roles can only be assigned by super admins
        
        return roleToAssign.getActive();
    }

    /**
     * Log access attempt for auditing
     */
    public void logAccessAttempt(BaseUserEntity user, PermissionEnum permission, boolean granted) {
        if (log.isDebugEnabled()) {
            log.debug("Permission check - User: {}, Permission: {}, Granted: {}", 
                    user != null ? user.getEmail() : "null", 
                    permission, 
                    granted);
        }
    }
}