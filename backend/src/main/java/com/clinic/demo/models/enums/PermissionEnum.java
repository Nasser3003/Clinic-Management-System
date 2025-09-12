package com.clinic.demo.models.enums;

import lombok.Getter;

@Getter
public enum PermissionEnum {

    // User Management Domain
    USER_READ("user:read", "Read user information"),
    USER_CREATE("user:create", "Create new users"),
    USER_UPDATE("user:update", "Update user information"),
    USER_DELETE("user:delete", "Delete users"),

    // Patient Management Domain
    PATIENT_READ("patient:read", "Read all patient information"),
    PATIENT_CREATE("patient:create", "Create new patient records"),
    PATIENT_UPDATE("patient:update", "Update patient information"),
    PATIENT_DELETE("patient:delete", "Delete patient records"),
    PATIENT_READ_OWN("patient:read:own", "Read own patient information"),

    // Medical Records Domain
    MEDICAL_RECORD_READ("medical_record:read", "Read medical records"),
    MEDICAL_RECORD_CREATE("medical_record:create", "Create medical records"),
    MEDICAL_RECORD_UPDATE("medical_record:update", "Update medical records"),
    MEDICAL_RECORD_READ_OWN("medical_record:read:own", "Read own medical records"),

    // Administrative Domain
    ADMIN_SYSTEM_CONFIG("admin:system:config", "Configure system settings"),
    ADMIN_USER_MANAGEMENT("admin:user:management", "Manage users and roles"),

    // Reports and Analytics Domain
    VIEW_REPORTS("reports:view", "View system reports"),
    CREATE_REPORTS("reports:create", "Create custom reports"),
    EXPORT_REPORTS("reports:export", "Export reports"),

    // Laboratory Domain
    ORDER_TESTS("lab:order", "Order laboratory tests"),
    VIEW_TEST_RESULTS("lab:results:view", "View test results"),
    UPDATE_TEST_RESULTS("lab:results:update", "Update test results"),

    // Appointment Domain
    APPOINTMENT_READ("appointment:read", "Read appointments"),
    APPOINTMENT_CREATE("appointment:create", "Create appointments"),
    APPOINTMENT_UPDATE("appointment:update", "Update appointments"),
    APPOINTMENT_DELETE("appointment:delete", "Delete appointments"),
    APPOINTMENT_READ_OWN("appointment:read:own", "Read own appointments");

    private final String code;
    private final String description;

    PermissionEnum(String code, String description) {
        this.code = code;
        this.description = description;
    }

    @Override
    public String toString() {
        return code;
    }
}