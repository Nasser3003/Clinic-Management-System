import api from './api';
import { AppointmentRequest, AvailableTimeSlot, DoctorAvailability } from '../types/appointment';

export interface AppointmentSearchParams {
    doctorEmail?: string;
    patientEmail?: string;
    statusEnum?: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
    startDate?: string; // YYYY-MM-DD format
    endDate?: string;   // YYYY-MM-DD format
}

export const appointmentService = {
    scheduleAppointment: async (appointment: AppointmentRequest): Promise<void> => {
        await api.post('/appointments/schedule', appointment);
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
        await api.post('/appointments/cancel', { uuid: appointmentId });
    },

    // New method for searching appointments
    searchAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search', {
            params: searchParams
        });
        return response.data;
    },

    // Search appointments by doctor
    searchDoctorAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search/doctor', {
            params: searchParams
        });
        return response.data;
    },

    // Search appointments by patient
    searchPatientAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search/patient', {
            params: searchParams
        });
        return response.data;
    },

    // Search appointments by both doctor and patient
    searchDoctorPatientAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search/doctor-and-patient', {
            params: searchParams
        });
        return response.data;
    },

    getAvailableSlots: async (doctorEmail: string, date: string, duration: number = 30): Promise<AvailableTimeSlot[]> => {
        const response = await api.get('/calendar/available-slots', {
            params: { doctorEmail, date, duration }
        });
        return response.data;
    },

    getAvailableDoctors: async (date: string, startTime: string, duration: number = 30): Promise<DoctorAvailability[]> => {
        const response = await api.get('/calendar/available-doctors', {
            params: { date, startTime, duration }
        });
        return response.data;
    },

    // Updated to use the search endpoint
    getDoctorCalendar: async (doctorEmail: string, startDate?: string, endDate?: string): Promise<any> => {
        return appointmentService.searchDoctorAppointments({
            doctorEmail,
            startDate,
            endDate
        });
    },

    // New method for patient calendar
    getPatientCalendar: async (patientEmail: string, startDate?: string, endDate?: string): Promise<any> => {
        return appointmentService.searchPatientAppointments({
            patientEmail,
            startDate,
            endDate
        });
    }
};