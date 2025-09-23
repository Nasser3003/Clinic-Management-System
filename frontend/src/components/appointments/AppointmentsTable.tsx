import React from 'react';
import { Appointment } from '../../types/appointment';

interface AppointmentsTableProps {
    appointments: Appointment[];
    isAdmin: boolean;
    isDoctor: boolean;
    onCancelAppointment: (id: string) => void;
    onCompleteAppointment: (id: string) => void;
}

function AppointmentsTable({
                               appointments,
                               isAdmin,
                               isDoctor,
                               onCancelAppointment,
                               onCompleteAppointment
                           }: AppointmentsTableProps) {
    const formatDate = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const formatTime = (dateTimeString: string) => {
        return new Date(dateTimeString).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'SCHEDULED': return 'scheduled';
            case 'COMPLETED': return 'completed';
            case 'CANCELLED': return 'cancelled';
            default: return '';
        }
    };

    // Calculate end time based on start time and duration
    const calculateEndTime = (startDateTime: string, duration: number) => {
        const startTime = new Date(startDateTime);
        const endTime = new Date(startTime.getTime() + duration * 60000);
        return endTime.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    // Get display names from email addresses - for now showing email until we can fetch names
    const getDisplayName = (email: string) => {
        // This is a temporary solution - in a real app you'd want to resolve emails to names
        return email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const truncateReason = (reason: string, maxLength: number = 50) => {
        if (!reason) return 'No reason provided';
        if (reason.length <= maxLength) return reason;
        return reason.substring(0, maxLength) + '...';
    };

    return (
        <div className="appointments-table">
            <table className="appointments-grid">
                <thead>
                <tr>
                    <th>Date & Time</th>
                    <th>Doctor</th>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {appointments.map((appointment) => (
                    <tr key={appointment.id}>
                        <td data-label="Date & Time">
                            <div className="appointment-time">
                                <span className="appointment-date">
                                    {formatDate(appointment.startDateTime)}
                                </span>
                                <span className="appointment-time-range">
                                    {formatTime(appointment.startDateTime)} → {calculateEndTime(appointment.startDateTime, appointment.duration)}
                                </span>
                            </div>
                        </td>
                        <td data-label="Doctor">{getDisplayName(appointment.doctorName)}</td>
                        <td data-label="Patient">{getDisplayName(appointment.patientName)}</td>
                        <td data-label="Reason">
                            <div className="appointment-reason" title={appointment.reason || 'No reason provided'}>
                                {truncateReason(appointment.reason)}
                            </div>
                        </td>
                        <td data-label="Duration">{appointment.duration} min</td>
                        <td data-label="Status">
                            <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                                {appointment.status}
                            </span>
                        </td>
                        <td data-label="Actions">
                            <div className="appointment-actions">
                                {appointment.status === 'SCHEDULED' && (isDoctor || isAdmin) && (
                                    <>
                                        <button
                                            onClick={() => onCompleteAppointment(appointment.id)}
                                            className="complete-btn"
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => onCancelAppointment(appointment.id)}
                                            className="cancel-btn"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                )}
                            </div>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default AppointmentsTable;