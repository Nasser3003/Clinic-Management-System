import api from './api';
import { Treatment, TreatmentFilters, Prescription } from '../types/treatments';

export interface TreatmentFilterRequest {
    doctorEmail?: string;
    patientEmail?: string;
    fromDate?: string; // YYYY-MM-DD format
    toDate?: string;   // YYYY-MM-DD format
    prescriptionName?: string;
    notes?: string;
}

export interface TreatmentUpdateRequest {
    notes?: string;
    amountPaid?: number;
    installmentPeriodInMonths?: number;
}

export const treatmentService = {
    filterTreatments: async (filters: TreatmentFilterRequest): Promise<Treatment[]> => {
        const response = await api.post('http://localhost:3001/treatments/filter', filters);
        return response.data;
    },

    getTreatmentById: async (treatmentId: string): Promise<Treatment> => {
        const response = await api.get(`http://localhost:3001/treatments/${treatmentId}`);
        return response.data;
    },

    getTreatmentsByPatient: async (email: string): Promise<Treatment[]> => {
        const response = await api.get(`http://localhost:3001/treatments/patient/${email}`);
        return response.data;
    },

    getTreatmentsByDoctor: async (email: string): Promise<Treatment[]> => {
        const response = await api.get(`http://localhost:3001/treatments/doctor/${email}`);
        return response.data;
    },

    updateTreatment: async (treatmentId: string, updateData: TreatmentUpdateRequest): Promise<void> => {
        await api.patch(`http://localhost:3001/treatments/${treatmentId}`, updateData);
    },

    updatePayment: async (treatmentId: string, amountPaid: number): Promise<void> => {
        await treatmentService.updateTreatment(treatmentId, { amountPaid });
    },

    updateNotes: async (treatmentId: string, notes: string): Promise<void> => {
        await treatmentService.updateTreatment(treatmentId, { notes });
    },

    updateInstallmentPeriod: async (treatmentId: string, installmentPeriodInMonths: number): Promise<void> => {
        await treatmentService.updateTreatment(treatmentId, { installmentPeriodInMonths });
    },

    formatCurrency: (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    },

    formatDate: (dateString: string): string => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    getPaymentStatus: (treatment: Treatment): 'Paid' | 'Unpaid' | 'Partial' => {
        if (treatment.remainingBalance === 0) return 'Paid';
        if (treatment.amountPaid === 0) return 'Unpaid';
        return 'Partial';
    },

    calculateRemainingBalance: (cost: number, amountPaid: number): number => {
        return Math.max(0, cost - amountPaid);
    },

    convertFiltersToRequest: (filters: TreatmentFilters): TreatmentFilterRequest => {
        const request: TreatmentFilterRequest = {};

        if (filters.doctorEmail?.trim()) request.doctorEmail = filters.doctorEmail.trim();
        if (filters.patientEmail?.trim()) request.patientEmail = filters.patientEmail.trim();
        if (filters.startDate) request.fromDate = filters.startDate;
        if (filters.endDate) request.toDate = filters.endDate;
        if (filters.prescriptionKeyword?.trim()) request.prescriptionName = filters.prescriptionKeyword.trim();
        if (filters.visitNotesKeyword?.trim()) request.notes = filters.visitNotesKeyword.trim();

        return request;
    },

    filterByPaymentStatus: (treatments: Treatment[], paidStatus: string): Treatment[] => {
        if (!paidStatus || paidStatus === '') return treatments;

        return treatments.filter(treatment => {
            const status = treatmentService.getPaymentStatus(treatment);
            if (paidStatus === 'true') return status === 'Paid';
            if (paidStatus === 'false') return status === 'Unpaid' || status === 'Partial';
            return true;
        });
    },

    highlightText: (text: string, keywords: string[]): string => {
        if (!keywords.length || !text) return text;

        let highlightedText = text;
        keywords.forEach(keyword => {
            if (keyword.trim()) {
                const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
            }
        });

        return highlightedText;
    },

    getSearchKeywords: (filters: TreatmentFilters): string[] => {
        const keywords = [];
        if (filters.prescriptionKeyword) keywords.push(filters.prescriptionKeyword);
        if (filters.visitNotesKeyword) keywords.push(filters.visitNotesKeyword);
        return keywords;
    }
};