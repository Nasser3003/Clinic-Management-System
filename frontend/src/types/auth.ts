export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'EMPLOYEE' | 'LAB_TECHNICIAN' | 'PATIENT' | 'PARTNER';
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