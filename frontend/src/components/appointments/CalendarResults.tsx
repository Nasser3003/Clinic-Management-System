import React from 'react';
import { Appointment } from '../../types/appointment';

interface CalendarView {
    doctorName?: string;
    doctorEmail?: string;
    patientEmail?: string;
    startDate: string;
    endDate: string;
    appointments: Appointment[];
}

interface CalendarResultsProps {
    calendarView: CalendarView;
    type: 'doctor' | 'patient';
}

function CalendarResults({ calendarView, type }: CalendarResultsProps) {
    const formatDateTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleString();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'scheduled';
            case 'COMPLETED': return 'completed';
            case 'CANCELLED': return 'cancelled';
            default: return '';
        }
    };

    const getDisplayName = () => {
        if (type === 'doctor') {
            return calendarView.doctorName;
        }
        return calendarView.patientEmail || 'Patient';
    };

    // Calculate end time based on start time and duration
    const calculateEndTime = (startDateTime: string, duration: number) => {
        const startTime = new Date(startDateTime);
        const endTime = new Date(startTime.getTime() + duration * 60000);
        return endTime.toLocaleTimeString();
    };

    // Get display names from email addresses - for now showing email until we can fetch names
    const getDisplayNameFromEmail = (email: string) => {
        // This is a temporary solution - in a real app you'd want to resolve emails to names
        return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <div className="calendar-results">
            <div className="calendar-header">
                <h4>{type === 'doctor' ? 'Calendar for' : 'Appointments for'} {getDisplayName()}</h4>
                <p>
                    {formatDate(calendarView.startDate)} - {formatDate(calendarView.endDate)}
                </p>
            </div>

            <div className="calendar-appointments">
                {calendarView.appointments.length === 0 ? (
                    <p>No appointments found in this date range</p>
                ) : (
                    <div className="appointments-list">
                        {calendarView.appointments.map((appointment) => (
                            <div key={appointment.id} className="calendar-appointment-card">
                                <div className="appointment-info">
                                    <div>
                                        <h5>
                                            {type === 'doctor'
                                                ? getDisplayNameFromEmail(appointment.patientEmail)
                                                : `Dr. ${getDisplayNameFromEmail(appointment.doctorEmail)}`
                                            }
                                        </h5>
                                        <p className="appointment-time">
                                            {formatDateTime(appointment.appointmentDateTime)} -
                                            {calculateEndTime(appointment.appointmentDateTime, appointment.duration)}
                                        </p>
                                        {appointment.treatmentDetails && (
                                            <p className="treatment-details">
                                                {appointment.treatmentDetails}
                                            </p>
                                        )}
                                    </div>
                                    <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                                        {appointment.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default CalendarResults;