export interface UserInfoDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    role: 'PATIENT' | 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'LAB_TECHNICIAN' | 'EMPLOYEE' | 'ADMIN';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: string;
    updatedAt?: string;
    // Doctor specific fields
    specialty?: string;
    licenseNumber?: string;
    // Staff specific fields
    department?: string;
    employeeId?: string;
}

export interface EmployeeRegistrationDTO {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role: 'DOCTOR' | 'NURSE' | 'RECEPTIONIST' | 'LAB_TECHNICIAN' | 'EMPLOYEE';
    // Doctor specific fields
    specialty?: string;
    licenseNumber?: string;
    // Staff specific fields
    department?: string;
    employeeId?: string;
}

export interface SystemStatistics {
    totalAppointments?: number;
    totalPatients: number;
    totalDoctors: number;
    totalStaff: number;
    pendingRequests?: number;
    monthlyRevenue?: number;
}

export interface EmployeeDTO {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    username: string;
    gender: string;
    userType: string;
    nationalId: string;
    dateOfBirth: string;
    authorities: string[];
    isDeleted: boolean;
    createDate: string;
    lastModifiedDate: string;
    isAccountNonExpired: boolean;
    isAccountNonLocked: boolean;
    isCredentialsNonExpired: boolean;
    isEnabled: boolean;
    emergencyContactName?: string;
    emergencyContactNumber?: string;
    notes?: string;
    salary: number;
    title?: string;
    department?: string;
    employmentStatus?: string;
    avatarPath?: string;
    description?: string;
    publicPhotoPath?: string;
}