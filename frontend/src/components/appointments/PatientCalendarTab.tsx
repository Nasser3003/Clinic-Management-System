import React from 'react';
import { User } from '../../types/auth';
import { Appointment } from '../../types/appointment';
import { appointmentService } from '../../services/appointmentService';
import CalendarForm from './CalendarForm';
import CalendarResults from "./CalendarResults";

interface CalendarView {
    doctorName?: string;
    doctorEmail?: string;
    patientEmail?: string;
    startDate: string;
    endDate: string;
    appointments: Appointment[];
}

interface PatientCalendarTabProps {
    calendarView: CalendarView | null;
    loading: boolean;
    isPatient: boolean;
    user: User | null;
    onCalendarLoaded: (data: CalendarView) => void;
    onError: (error: string) => void;
    onLoading: (loading: boolean) => void;
}

function PatientCalendarTab({
                                calendarView,
                                loading,
                                isPatient,
                                user,
                                onCalendarLoaded,
                                onError,
                                onLoading
                            }: PatientCalendarTabProps) {

    const handleCalendarSubmit = async (data: {
        name: string;
        email: string;
        startDate: string;
        endDate: string;
        status: string;
    }) => {
        onLoading(true);

        try {
            // Use appointmentService to search patient appointments
            const searchParams = {
                patientEmail: data.email,
                ...(data.startDate && { startDate: data.startDate }),
                ...(data.endDate && { endDate: data.endDate }),
                ...(data.status && { statusEnum: data.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELED' })
            };

            const appointments = await appointmentService.searchPatientAppointments(searchParams);

            const calendarData: CalendarView = {
                patientEmail: data.email,
                startDate: data.startDate || '',
                endDate: data.endDate || '',
                appointments
            };

            onCalendarLoaded(calendarData);
        } catch (err: any) {
            console.error('Error loading patient calendar:', err);
            onError(err.message || 'Failed to load patient calendar');
        } finally {
            onLoading(false);
        }
    };

    const getDefaultName = () => {
        if (isPatient && user?.firstName && user?.lastName)
            return `${user.firstName} ${user.lastName}`;
        return '';
    };

    return (
        <div className="patient-calendar-section">
            <div className="section-header">
                <h3>Patient Calendar View</h3>
                <p>View a patient's appointment history</p>
            </div>

            <CalendarForm
                onSubmit={handleCalendarSubmit}
                loading={loading}
                nameLabel="Patient Name"
                namePlaceholder="Enter patient name"
                defaultName={getDefaultName()}
                buttonText="Load Calendar"
                searchType="patient"
            />

            {calendarView && (
                <CalendarResults
                    calendarView={calendarView}
                    type="patient"
                />
            )}
        </div>
    );
}

export default PatientCalendarTab;