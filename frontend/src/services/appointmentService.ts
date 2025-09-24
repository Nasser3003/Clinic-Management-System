import api from './api';
import { AppointmentRequest, AvailableTimeSlot, DoctorAvailability } from '../types/appointment';

export interface AppointmentSearchParams {
    doctorEmail?: string;
    patientEmail?: string;
    statusEnum?: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
    startDate?: string; // YYYY-MM-DD format
    endDate?: string;   // YYYY-MM-DD format
}

// Updated interface to match your actual API response
export interface AppointmentDTO {
    id: string;
    doctorName: string;
    patientName: string;
    startDateTime: string;
    endDateTime: string;
    duration: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    reason: string;
}

export const appointmentService = {
    scheduleAppointment: async (appointment: AppointmentRequest): Promise<void> => {
        await api.post('/appointments/schedule', appointment);
    },

    cancelAppointment: async (appointmentId: string): Promise<void> => {
        await api.post('/appointments/cancel', { uuid: appointmentId });
    },

    getAllScheduledAppointments: async (): Promise<AppointmentDTO[]> => {
        const response = await api.get('/appointments/all-scheduled');
        return response.data;
    },

    searchAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search', {
            params: searchParams
        });
        return response.data;
    },

    searchDoctorAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search/doctor', {
            params: searchParams
        });
        return response.data;
    },

    searchPatientAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search/patient', {
            params: searchParams
        });
        return response.data;
    },

    searchDoctorPatientAppointments: async (searchParams: AppointmentSearchParams): Promise<any> => {
        const response = await api.get('/appointments/search/doctor-and-patient', {
            params: searchParams
        });
        return response.data;
    },

    // Helper method to get next appointment for a specific patient
    getNextAppointmentForPatient: (patientFirstName: string, patientLastName: string, appointments: AppointmentDTO[]): AppointmentDTO | undefined => {
        const fullPatientName = `${patientFirstName} ${patientLastName}`;
        const patientAppointments = appointments.filter(
            appointment =>
                appointment.status === 'SCHEDULED' &&
                appointment.patientName.toLowerCase() === fullPatientName.toLowerCase()
        );

        if (patientAppointments.length === 0) return undefined;

        // Sort by startDateTime to get the next appointment
        const sortedAppointments = patientAppointments.sort((a, b) => {
            const dateA = new Date(a.startDateTime);
            const dateB = new Date(b.startDateTime);
            return dateA.getTime() - dateB.getTime();
        });

        return sortedAppointments[0];
    },

    // Helper method to format appointment date and time
    formatAppointmentDateTime: (appointment: AppointmentDTO): string => {
        try {
            const startDate = new Date(appointment.startDateTime);

            const formattedDate = startDate.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });

            const formattedTime = startDate.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            });

            return `${formattedDate} at ${formattedTime}`;
        } catch (error) {
            return 'Invalid date';
        }
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