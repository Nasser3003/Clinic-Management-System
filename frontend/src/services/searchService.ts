import api from './api';

export interface SearchResult {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    nationalId?: string;
    role: string;
    avatar?: string;
    isActive?: boolean;
    jobTitle?: string;
    speciality?: string;
}

export interface SearchResponse {
    results: SearchResult[];
    total: number;
}

export const searchService = {
    searchUsers: async (
        query: string,
        userTypes: string[] = ['PATIENT'],
        limit: number = 6
    ): Promise<SearchResponse> => {
        const typeParams = userTypes.map(type => `types=${type}`).join('&');
        const response = await api.get(
            `/users/search?q=${encodeURIComponent(query)}&${typeParams}&limit=${limit}`
        );
        return response.data;
    },

    searchPatients: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['PATIENT'], limit);
    },

    searchDoctors: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['DOCTOR'], limit);
    },

    searchEmployees: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['EMPLOYEE', 'DOCTOR', 'NURSE', 'ADMIN', 'RECEPTIONIST', 'LAB_TECHNICIAN'], limit);
    },

    searchStaff: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['NURSE', 'EMPLOYEE', 'RECEPTIONIST', 'LAB_TECHNICIAN'], limit);
    },

    searchMedicalStaff: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['DOCTOR', 'NURSE'], limit);
    },

    searchAll: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['PATIENT', 'EMPLOYEE', 'DOCTOR', 'NURSE', 'ADMIN', 'RECEPTIONIST', 'LAB_TECHNICIAN'], limit);
    },

    // Advanced search with multiple filters
    searchAdvanced: async (filters: {
        query?: string;
        userTypes?: string[];
        speciality?: string;
        isActive?: boolean;
        limit?: number;
    }): Promise<SearchResponse> => {
        const params = new URLSearchParams();

        if (filters.query) params.append('q', filters.query);
        if (filters.userTypes) {
            filters.userTypes.forEach(type => params.append('types', type));
        }
        if (filters.speciality) params.append('speciality', filters.speciality);
        if (filters.isActive !== undefined) params.append('isActive', filters.isActive.toString());
        if (filters.limit) params.append('limit', filters.limit.toString());

        const response = await api.get(`/users/search?${params.toString()}`);
        return response.data;
    },

    // Search doctors by speciality
    searchDoctorsBySpeciality: async (speciality: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchAdvanced({
            userTypes: ['DOCTOR'],
            speciality,
            limit
        });
    }
};