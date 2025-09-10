import api from './api';
import { AppointmentRequest, AvailableTimeSlot, DoctorAvailability } from '../types/appointment';

export const appointmentService = {
  scheduleAppointment: async (appointment: AppointmentRequest): Promise<void> => {
    await api.post('/appointments/schedule', appointment);
  },

  cancelAppointment: async (appointmentId: string): Promise<void> => {
    await api.post('/appointments/cancel', { uuid: appointmentId });
  },

  getAvailableSlots: async (doctorEmail: string, date: string, duration: number = 30): Promise<AvailableTimeSlot[]> => {
    const response = await api.get('/api/calendar/available-slots', {
      params: { doctorEmail, date, duration }
    });
    return response.data;
  },

  getAvailableDoctors: async (date: string, startTime: string, duration: number = 30): Promise<DoctorAvailability[]> => {
    const response = await api.get('/api/calendar/available-doctors', {
      params: { date, startTime, duration }
    });
    return response.data;
  },

  getDoctorCalendar: async (doctorEmail: string, startDate: string, endDate: string): Promise<any> => {
    const response = await api.get(`/api/calendar/doctor/${doctorEmail}`, {
      params: { startDate, endDate }
    });
    return response.data;
  }
};