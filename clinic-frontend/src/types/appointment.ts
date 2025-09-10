export interface Appointment {
  id: string;
  patientEmail: string;
  doctorEmail: string;
  appointmentDateTime: string;
  duration: number;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  treatmentDetails?: string;
}

export interface AppointmentRequest {
  patientEmail: string;
  doctorEmail: string;
  dateTime: string;  // Changed from appointmentDateTime to match backend
  duration: number;
}

export interface AvailableTimeSlot {
  startTime: string;
  endTime: string;
  available: boolean;
}

export interface DoctorAvailability {
  doctorEmail: string;
  firstName: string;
  lastName: string;
  available: boolean;
}