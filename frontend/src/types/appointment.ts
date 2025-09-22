export interface Appointment {
    id: string;
    doctorName: string;
    patientName: string;
    startDateTime: string;
    endDateTime?: string;
    duration: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELED';
    reason: string;
    treatmentDetails?: string;
}

export interface AppointmentRequest {
    doctorEmail: string;
    patientEmail: string;
    dateTime: string;
    duration: number;
    reason: string;
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