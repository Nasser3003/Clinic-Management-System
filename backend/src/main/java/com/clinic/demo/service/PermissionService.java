package com.clinic.demo.service;

import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.enums.PermissionEnum;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Set;

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

        boolean hasPermission = user.hasPermission(permission);
        logAccessAttempt(user, permission, hasPermission);
        return hasPermission;
    }

    /**
     * Check if a user has any of the specified permissions
     */
    public boolean hasAnyPermission(BaseUserEntity user, PermissionEnum... permissions) {
        if (user == null || permissions == null || permissions.length == 0)
            return false;

        boolean hasAny = user.hasAnyPermission(permissions);
        if (log.isDebugEnabled()) {
            log.debug("User {} checking any permissions: {} - Result: {}",
                    user.getEmail(), permissions, hasAny);
        }
        return hasAny;
    }

    /**
     * Check if a user has all of the specified permissions
     */
    public boolean hasAllPermissions(BaseUserEntity user, PermissionEnum... permissions) {
        if (user == null || permissions == null || permissions.length == 0)
            return false;

        boolean hasAll = user.hasAllPermissions(permissions);
        if (log.isDebugEnabled()) {
            log.debug("User {} checking all permissions: {} - Result: {}",
                    user.getEmail(), permissions, hasAll);
        }
        return hasAll;
    }

    /**
     * Get all permissions for a user
     */
    public Set<PermissionEnum> getUserPermissions(BaseUserEntity user) {
        if (user == null)
            return Set.of();

        return user.getPermissions();
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
                                permission == PermissionEnum.ORDER_TESTS ||
                                permission == PermissionEnum.VIEW_TEST_RESULTS);
    }

    /**
     * Check if user can assign permissions to another user
     */
    public boolean canAssignPermissions(BaseUserEntity assigner) {
        // Only users with admin user management permission can assign permissions
        return hasPermission(assigner, PermissionEnum.ADMIN_USER_MANAGEMENT);
    }

    /**
     * Check if user can assign a specific permission to another user
     */
    public boolean canAssignPermission(BaseUserEntity assigner, PermissionEnum permissionToAssign) {
        if (!canAssignPermissions(assigner))
            return false;

        // Additional business rules can be added here
        // For example: only super admins can assign certain permissions
        // or users can only assign permissions they already have

        return true;
    }

    /**
     * Grant permission to a user (with permission check)
     */
    public boolean grantPermission(BaseUserEntity granter, BaseUserEntity targetUser, PermissionEnum permission) {
        if (!canAssignPermission(granter, permission)) {
            log.warn("User {} attempted to grant permission {} to {} but lacks authorization",
                    granter.getEmail(), permission, targetUser.getEmail());
            return false;
        }

        targetUser.addPermission(permission);
        log.info("User {} granted permission {} to {}",
                granter.getEmail(), permission, targetUser.getEmail());
        return true;
    }

    /**
     * Revoke permission from a user (with permission check)
     */
    public boolean revokePermission(BaseUserEntity revoker, BaseUserEntity targetUser, PermissionEnum permission) {
        if (!canAssignPermissions(revoker)) {
            log.warn("User {} attempted to revoke permission {} from {} but lacks authorization",
                    revoker.getEmail(), permission, targetUser.getEmail());
            return false;
        }

        targetUser.removePermission(permission);
        log.info("User {} revoked permission {} from {}",
                revoker.getEmail(), permission, targetUser.getEmail());
        return true;
    }

    /**
     * Check if user can read specific patient data
     */
    public boolean canReadPatientData(BaseUserEntity user, String patientId) {
        // Can read all patient data
        if (hasPermission(user, PermissionEnum.PATIENT_READ))
            return true;

        // Can read own data if user is the patient
        if (hasPermission(user, PermissionEnum.PATIENT_READ_OWN) &&
                user.getId().toString().equals(patientId))
            return true;

        return false;
    }

    /**
     * Check if user can read specific medical records
     */
    public boolean canReadMedicalRecord(BaseUserEntity user, String patientId) {
        // Can read all medical records
        if (hasPermission(user, PermissionEnum.MEDICAL_RECORD_READ))
            return true;

        // Can read own medical records if user is the patient
        if (hasPermission(user, PermissionEnum.MEDICAL_RECORD_READ_OWN) &&
                user.getId().toString().equals(patientId))
            return true;

        return false;
    }

    /**
     * Check if user can read specific appointments
     */
    public boolean canReadAppointment(BaseUserEntity user, String patientId) {
        // Can read all appointments
        if (hasPermission(user, PermissionEnum.APPOINTMENT_READ))
            return true;

        // Can read own appointments if user is the patient
        if (hasPermission(user, PermissionEnum.APPOINTMENT_READ_OWN) &&
                user.getId().toString().equals(patientId))
            return true;

        return false;
    }

    /**
     * Check if user has clinical permissions (doctor, nurse, etc.)
     */
    public boolean hasClinicalPermissions(BaseUserEntity user) {
        return hasAnyPermission(user,
                PermissionEnum.PATIENT_READ,
                PermissionEnum.MEDICAL_RECORD_READ,
                PermissionEnum.MEDICAL_RECORD_CREATE,
                PermissionEnum.MEDICAL_RECORD_UPDATE,
                PermissionEnum.ORDER_TESTS,
                PermissionEnum.VIEW_TEST_RESULTS,
                PermissionEnum.UPDATE_TEST_RESULTS);
    }

    /**
     * Check if user has reporting permissions
     */
    public boolean hasReportingPermissions(BaseUserEntity user) {
        return hasAnyPermission(user,
                PermissionEnum.VIEW_REPORTS,
                PermissionEnum.CREATE_REPORTS,
                PermissionEnum.EXPORT_REPORTS);
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

    /**
     * Get user permission summary for debugging
     */
    public String getUserPermissionSummary(BaseUserEntity user) {
        if (user == null)
            return "User is null";

        Set<PermissionEnum> permissions = user.getPermissions();
        return String.format("User: %s, UserType: %s, Permissions: %s",
                user.getEmail(),
                user.getUserType(),
                permissions);
    }
}