export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    userType: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'EMPLOYEE' | 'LAB_TECHNICIAN' | 'PATIENT' | 'PARTNER';
    permissions: string[]; // Array of permissions
    phoneNumber?: string;
    gender?: 'M' | 'F';
    dateOfBirth?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    nationalId?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    jwt: string;
    user: User;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    gender: string;
    dob: string;
}

// For profile updates
export interface ProfileUpdateRequest {
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
    gender?: 'M' | 'F';
    dateOfBirth?: string;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
}

// Permission constants for easy reference
export const PERMISSIONS = {
    // User Management
    USER_READ: 'USER_READ',
    USER_CREATE: 'USER_CREATE',
    USER_UPDATE: 'USER_UPDATE',
    USER_DELETE: 'USER_DELETE',

    // Patient Management
    PATIENT_READ: 'PATIENT_READ',
    PATIENT_CREATE: 'PATIENT_CREATE',
    PATIENT_UPDATE: 'PATIENT_UPDATE',
    PATIENT_DELETE: 'PATIENT_DELETE',
    PATIENT_READ_OWN: 'PATIENT_READ_OWN',

    // Medical Records
    MEDICAL_RECORD_READ: 'MEDICAL_RECORD_READ',
    MEDICAL_RECORD_CREATE: 'MEDICAL_RECORD_CREATE',
    MEDICAL_RECORD_UPDATE: 'MEDICAL_RECORD_UPDATE',
    MEDICAL_RECORD_READ_OWN: 'MEDICAL_RECORD_READ_OWN',

    // Admin
    ADMIN_SYSTEM_CONFIG: 'ADMIN_SYSTEM_CONFIG',
    ADMIN_USER_MANAGEMENT: 'ADMIN_USER_MANAGEMENT',

    // Reports
    VIEW_REPORTS: 'VIEW_REPORTS',
    CREATE_REPORTS: 'CREATE_REPORTS',
    EXPORT_REPORTS: 'EXPORT_REPORTS',

    // Laboratory
    ORDER_TESTS: 'ORDER_TESTS',
    VIEW_TEST_RESULTS: 'VIEW_TEST_RESULTS',
    UPDATE_TEST_RESULTS: 'UPDATE_TEST_RESULTS',

    // Appointments
    APPOINTMENT_READ: 'APPOINTMENT_READ',
    APPOINTMENT_CREATE: 'APPOINTMENT_CREATE',
    APPOINTMENT_UPDATE: 'APPOINTMENT_UPDATE',
    APPOINTMENT_DELETE: 'APPOINTMENT_DELETE',
    APPOINTMENT_READ_OWN: 'APPOINTMENT_READ_OWN'
} as const;

export type PermissionType = typeof PERMISSIONS[keyof typeof PERMISSIONS];