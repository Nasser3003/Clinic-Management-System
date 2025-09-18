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

    searchEmployees: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['EMPLOYEE', 'DOCTOR', 'NURSE', 'ADMIN', 'RECEPTIONIST', 'LAB_TECHNICIAN'], limit);
    },

    searchAll: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['PATIENT', 'EMPLOYEE', 'PARTNER'], limit);
    }
};