import api from './api';
import {EmployeeDTO, EmployeeRegistrationDTO, UserInfoDTO} from '../types/admin';
import { hasPermission, hasAnyPermission } from '../utils/jwtDecoder';
import { PERMISSIONS } from '../types/auth';

export const adminService = {
    // Permission checking helper
    checkPermission: (permission: string): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        return hasPermission(token, permission);
    },

    checkAnyPermission: (permissions: string[]): boolean => {
        const token = localStorage.getItem('token');
        if (!token) return false;
        return hasAnyPermission(token, permissions);
    },

    // Get all users (requires USER_READ permission)
    getAllUsers: async (): Promise<UserInfoDTO[]> => {
        if (!adminService.checkPermission(PERMISSIONS.USER_READ)) {
            throw new Error('Access denied: USER_READ permission required');
        }
        const response = await api.get('/admin/users');
        return response.data;
    },

    // Get appointments count
    getAppointmentsThisMonthCount: async (): Promise<number> => {
        if (!adminService.checkPermission(PERMISSIONS.APPOINTMENT_READ)) {
            throw new Error('Access denied: APPOINTMENT_READ permission required');
        }
        const response = await api.get('/admin/api/v01/appointments-this-month');
        return response.data;
    },

    // Get all doctors
    getAllDoctors: async (): Promise<EmployeeDTO[]> => {
        if (!adminService.checkAnyPermission([PERMISSIONS.USER_READ])) {
            throw new Error('Access denied: USER_READ');
        }
        const response = await api.get('/admin/api/v01/get-all-doctors');
        return response.data;
    },

    // Get all staff
    getAllStaff: async (): Promise<EmployeeDTO[]> => {
        if (!adminService.checkAnyPermission([PERMISSIONS.USER_READ])) {
            throw new Error('Access denied: USER_READ ');
        }
        const response = await api.get('/admin/api/v01/get-all-staff');
        return response.data;
    },

    getAllPatients: async (): Promise<EmployeeDTO[]> => {
        if (!adminService.checkAnyPermission([PERMISSIONS.USER_READ])) {
            throw new Error('Access denied: USER_READ ');
        }
        const response = await api.get('/admin/api/v01/get-all-patients');
        return response.data;
    },

    // Get user by email
    getUserByEmail: async (email: string): Promise<UserInfoDTO> => {
        if (!adminService.checkPermission(PERMISSIONS.USER_READ)) {
            throw new Error('Access denied: USER_READ permission required');
        }
        const response = await api.get(`/admin/email/${email}`);
        return response.data;
    },

    // Register new employee (requires USER_CREATE permission)
    registerEmployee: async (employeeData: EmployeeRegistrationDTO): Promise<void> => {
        if (!adminService.checkPermission(PERMISSIONS.USER_CREATE)) {
            throw new Error('Access denied: USER_CREATE permission required');
        }
        await api.post('/admin/register-employee', employeeData);
    },

    // Get count statistics
    getActiveDoctorsCount: async (): Promise<number> => {
        if (!adminService.checkAnyPermission([PERMISSIONS.USER_READ, PERMISSIONS.VIEW_REPORTS])) {
            throw new Error('Access denied: USER_READ or VIEW_REPORTS permission required');
        }
        const response = await api.get('/admin/api/v01/doctors-count');
        return response.data;
    },

    getActivePatientsCount: async (): Promise<number> => {
        if (!adminService.checkAnyPermission([PERMISSIONS.PATIENT_READ, PERMISSIONS.VIEW_REPORTS])) {
            throw new Error('Access denied: PATIENT_READ or VIEW_REPORTS permission required');
        }
        const response = await api.get('/admin/api/v01/patients-count');
        return response.data;
    },

    getActiveStaffCount: async (): Promise<number> => {
        if (!adminService.checkAnyPermission([PERMISSIONS.USER_READ, PERMISSIONS.VIEW_REPORTS])) {
            throw new Error('Access denied: USER_READ or VIEW_REPORTS permission required');
        }
        const response = await api.get('/admin/api/v01/staff-count');
        return response.data;
    },

    // Helper method to get all statistics at once
    getSystemStatistics: async () => {
        // Check if user has any reporting permissions
        if (!adminService.checkAnyPermission([
            PERMISSIONS.VIEW_REPORTS,
            PERMISSIONS.USER_READ,
            PERMISSIONS.PATIENT_READ
        ])) {
            throw new Error('Access denied: Insufficient permissions for system statistics');
        }

        try {
            const [doctorsCount, patientsCount, staffCount] = await Promise.all([
                adminService.getActiveDoctorsCount().catch(() => 0),
                adminService.getActivePatientsCount().catch(() => 0),
                adminService.getActiveStaffCount().catch(() => 0)
            ]);

            return {
                totalDoctors: doctorsCount,
                totalPatients: patientsCount,
                totalStaff: staffCount
            };
        } catch (error) {
            console.error('Error fetching system statistics:', error);
            return {
                totalDoctors: 0,
                totalPatients: 0,
                totalStaff: 0
            };
        }
    },

    // Permission checking utilities for UI
    canCreateUsers: (): boolean => {
        return adminService.checkPermission(PERMISSIONS.USER_CREATE);
    },

    canReadUsers: (): boolean => {
        return adminService.checkPermission(PERMISSIONS.USER_READ);
    },

    canUpdateUsers: (): boolean => {
        return adminService.checkPermission(PERMISSIONS.USER_UPDATE);
    },

    canDeleteUsers: (): boolean => {
        return adminService.checkPermission(PERMISSIONS.USER_DELETE);
    },

    canManageSystem: (): boolean => {
        return adminService.checkAnyPermission([
            PERMISSIONS.ADMIN_SYSTEM_CONFIG,
            PERMISSIONS.ADMIN_USER_MANAGEMENT
        ]);
    },

    canViewReports: (): boolean => {
        return adminService.checkPermission(PERMISSIONS.VIEW_REPORTS);
    },

    // Get user permissions for debugging
    getUserPermissions: (): string[] => {
        const token = localStorage.getItem('token');
        if (!token) return [];

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            if (payload.permissions && typeof payload.permissions === 'string') {
                return payload.permissions.split(',').map((p: string) => p.trim());
            }
        } catch (error) {
            console.error('Error extracting permissions:', error);
        }

        return [];
    }
};