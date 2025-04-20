package com.clinic.demo.models.enums;

public enum PermissionEnum {
    // Patient record permissions
    VIEW_PATIENT_RECORDS,
    CREATE_PATIENT_RECORDS,
    EDIT_PATIENT_RECORDS,
    DELETE_PATIENT_RECORDS,

    // Appointment permissions
    SCHEDULE_APPOINTMENTS,
    CANCEL_APPOINTMENTS,
    VIEW_APPOINTMENTS,

    // User management
    MANAGE_USERS,
    MANAGE_ROLES,

    // Medical permissions
    PRESCRIBE_MEDICATION,
    ORDER_TESTS,
    VIEW_TEST_RESULTS,

    // Billing permissions
    CREATE_INVOICES,
    VIEW_INVOICES,
    PROCESS_PAYMENTS,

    // System permissions
    VIEW_REPORTS,
    CONFIGURE_SYSTEM
}