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
        userTypes: string[] = [],
        limit: number = 6
    ): Promise<SearchResponse> => {
        const params = new URLSearchParams();
        params.append('q', query);
        userTypes.forEach(type => params.append('types', type));
        params.append('limit', limit.toString());

        const response = await api.get(`/admin/search/employee?${params.toString()}`);
        return response.data;
    },

    searchPatients: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        const params = new URLSearchParams();
        params.append('q', query);
        params.append('limit', limit.toString());

        const response = await api.get(`/admin/search/patient?${params.toString()}`);
        return response.data;
    },

    searchEmployees: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(
            query,
            ['EMPLOYEE', 'DOCTOR', 'NURSE', 'ADMIN', 'RECEPTIONIST', 'LAB_TECHNICIAN'],
            limit
        );
    },

    searchDoctors: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['DOCTOR'], limit);
    },

    searchReceptionists: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['RECEPTIONIST'], limit);
    },

    searchNurses: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['NURSE'], limit);
    },

    searchLabTechnicians: async (query: string, limit: number = 6): Promise<SearchResponse> => {
        return searchService.searchUsers(query, ['LAB_TECHNICIAN'], limit);
    },
};
