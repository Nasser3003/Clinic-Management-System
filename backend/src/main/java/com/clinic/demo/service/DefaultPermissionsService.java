package com.clinic.demo.service;

import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import org.springframework.stereotype.Service;

import java.util.EnumMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
public class DefaultPermissionsService {

    public Map<UserTypeEnum, Set<PermissionEnum>> getDefaultPermissionsMap() {
        Map<UserTypeEnum, Set<PermissionEnum>> permissionsMap = new EnumMap<>(UserTypeEnum.class);

        // ADMIN - System administration and user management
        permissionsMap.put(UserTypeEnum.ADMIN, Set.of(
            // User Management
            PermissionEnum.USER_READ,
            PermissionEnum.USER_CREATE,
            PermissionEnum.USER_UPDATE,
            PermissionEnum.USER_DELETE,

            // Patient Management (limited)
            PermissionEnum.PATIENT_READ,
            PermissionEnum.PATIENT_CREATE,
            PermissionEnum.PATIENT_UPDATE,

            // System Administration
            PermissionEnum.ADMIN_SYSTEM_CONFIG,
            PermissionEnum.ADMIN_USER_MANAGEMENT,

            // Reports
            PermissionEnum.VIEW_REPORTS,
            PermissionEnum.CREATE_REPORTS,
            PermissionEnum.EXPORT_REPORTS,

            // Appointments (administrative view)
            PermissionEnum.APPOINTMENT_READ,
            PermissionEnum.APPOINTMENT_CREATE,
            PermissionEnum.APPOINTMENT_UPDATE
        ));

        // DOCTOR - Clinical care and patient management
        permissionsMap.put(UserTypeEnum.DOCTOR, Set.of(
            // Patient Management (full clinical access)
            PermissionEnum.PATIENT_READ,
            PermissionEnum.PATIENT_CREATE,
            PermissionEnum.PATIENT_UPDATE,
            PermissionEnum.PATIENT_DELETE,

            // Medical Records (full access)
            PermissionEnum.MEDICAL_RECORD_READ,
            PermissionEnum.MEDICAL_RECORD_CREATE,
            PermissionEnum.MEDICAL_RECORD_UPDATE,

            // Laboratory
            PermissionEnum.ORDER_TESTS,
            PermissionEnum.VIEW_TEST_RESULTS,

            // Appointments
            PermissionEnum.APPOINTMENT_READ,
            PermissionEnum.APPOINTMENT_CREATE,
            PermissionEnum.APPOINTMENT_UPDATE,
            PermissionEnum.APPOINTMENT_DELETE,

            // Reports (clinical)
            PermissionEnum.VIEW_REPORTS
        ));

        // NURSE - Patient care support
        permissionsMap.put(UserTypeEnum.NURSE, Set.of(
            // Patient Management (care-focused)
            PermissionEnum.PATIENT_READ,
            PermissionEnum.PATIENT_UPDATE,

            // Medical Records
            PermissionEnum.MEDICAL_RECORD_READ,
            PermissionEnum.MEDICAL_RECORD_CREATE,
            PermissionEnum.MEDICAL_RECORD_UPDATE,

            // Laboratory (view only)
            PermissionEnum.VIEW_TEST_RESULTS,

            // Appointments
            PermissionEnum.APPOINTMENT_READ,
            PermissionEnum.APPOINTMENT_UPDATE
        ));

        // PATIENT - Self-service access only
        permissionsMap.put(UserTypeEnum.PATIENT, Set.of(
            // Own data only
            PermissionEnum.PATIENT_READ_OWN,
            PermissionEnum.MEDICAL_RECORD_READ_OWN,
            PermissionEnum.APPOINTMENT_READ_OWN,

            // Can schedule appointments
            PermissionEnum.APPOINTMENT_CREATE,

            // Can view own test results
            PermissionEnum.VIEW_TEST_RESULTS
        ));

        // EMPLOYEE - General staff with medical record access
        permissionsMap.put(UserTypeEnum.EMPLOYEE, Set.of(
            // Medical Records
            PermissionEnum.MEDICAL_RECORD_READ,
            PermissionEnum.MEDICAL_RECORD_CREATE,
            PermissionEnum.MEDICAL_RECORD_UPDATE,

            // Basic patient info
            PermissionEnum.PATIENT_READ,

            // Appointments (basic)
            PermissionEnum.APPOINTMENT_READ
        ));

        // RECEPTIONIST - Front desk operations
        permissionsMap.put(UserTypeEnum.RECEPTIONIST, Set.of(
            // Patient Management
            PermissionEnum.PATIENT_READ,
            PermissionEnum.PATIENT_CREATE,
            PermissionEnum.PATIENT_UPDATE,

            // Appointments (full scheduling access)
            PermissionEnum.APPOINTMENT_READ,
            PermissionEnum.APPOINTMENT_CREATE,
            PermissionEnum.APPOINTMENT_UPDATE,
            PermissionEnum.APPOINTMENT_DELETE,

            // Basic reports
            PermissionEnum.VIEW_REPORTS
        ));

        // LAB_TECHNICIAN - Laboratory operations
        permissionsMap.put(UserTypeEnum.LAB_TECHNICIAN, Set.of(
            // Patient info (for test context)
            PermissionEnum.PATIENT_READ,

            // Laboratory (full access)
            PermissionEnum.VIEW_TEST_RESULTS,
            PermissionEnum.UPDATE_TEST_RESULTS,

            // Medical Records (limited - for test context)
            PermissionEnum.MEDICAL_RECORD_READ
        ));

        // PARTNER - External organization access
        permissionsMap.put(UserTypeEnum.PARTNER, Set.of(
            // Limited reporting access
            PermissionEnum.VIEW_REPORTS,

            // Can order tests (if integrated partner)
            PermissionEnum.ORDER_TESTS,

            // Can view test results (for referred patients)
            PermissionEnum.VIEW_TEST_RESULTS
        ));

        return permissionsMap;
    }

    public Set<PermissionEnum> getDefaultPermissionsForUserType(UserTypeEnum userType) {
        return getDefaultPermissionsMap().getOrDefault(userType, new HashSet<>());
    }

    public boolean isPermissionDefaultForUserType(UserTypeEnum userType, PermissionEnum permission) {
        Set<PermissionEnum> defaultPermissions = getDefaultPermissionsForUserType(userType);
        return defaultPermissions.contains(permission);
    }

    public Set<UserTypeEnum> getUserTypesWithPermission(PermissionEnum permission) {
        Set<UserTypeEnum> userTypes = new HashSet<>();
        Map<UserTypeEnum, Set<PermissionEnum>> permissionsMap = getDefaultPermissionsMap();

        for (Map.Entry<UserTypeEnum, Set<PermissionEnum>> entry : permissionsMap.entrySet()) {
            if (entry.getValue().contains(permission)) {
                userTypes.add(entry.getKey());
            }
        }

        return userTypes;
    }

    public Set<PermissionEnum> getRecommendedPermissions(UserTypeEnum userType) {
        Set<PermissionEnum> recommended = new HashSet<>(getDefaultPermissionsForUserType(userType));

        // Add role-specific recommendations
        if (userType.isClinicalRole()) {
            recommended.add(PermissionEnum.VIEW_REPORTS);
        }

        if (userType.isAdministrativeRole()) {
            recommended.add(PermissionEnum.VIEW_REPORTS);
            recommended.add(PermissionEnum.EXPORT_REPORTS);
        }

        return recommended;
    }
}