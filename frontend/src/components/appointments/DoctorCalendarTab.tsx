import React from 'react';
import { User } from '../../types/auth';
import { Appointment } from '../../types/appointment';
import { appointmentService } from '../../services/appointmentService';
import CalendarForm from './CalendarForm';
import CalendarResults from './CalendarResults';

interface CalendarView {
    doctorName?: string;
    doctorEmail?: string;
    patientEmail?: string;
    startDate: string;
    endDate: string;
    appointments: Appointment[];
}

interface DoctorCalendarTabProps {
    calendarView: CalendarView | null;
    loading: boolean;
    isDoctor: boolean;
    user: User | null;
    onCalendarLoaded: (data: CalendarView) => void;
    onError: (error: string) => void;
    onLoading: (loading: boolean) => void;
}

function DoctorCalendarTab({
                               calendarView,
                               loading,
                               isDoctor,
                               user,
                               onCalendarLoaded,
                               onError,
                               onLoading
                           }: DoctorCalendarTabProps) {

    const handleCalendarSubmit = async (data: {
        name: string;
        email: string;
        startDate: string;
        endDate: string;
        status: string;
    }) => {
        onLoading(true);

        try {
            // Use appointmentService to search doctor appointments
            const searchParams = {
                doctorEmail: data.email,
                ...(data.startDate && { startDate: data.startDate }),
                ...(data.endDate && { endDate: data.endDate }),
                ...(data.status && { statusEnum: data.status as 'SCHEDULED' | 'COMPLETED' | 'CANCELED' })
            };

            const appointments = await appointmentService.searchDoctorAppointments(searchParams);

            const calendarData: CalendarView = {
                doctorName: data.name,
                doctorEmail: data.email,
                startDate: data.startDate || '',
                endDate: data.endDate || '',
                appointments
            };

            onCalendarLoaded(calendarData);
        } catch (err: any) {
            console.error('Error loading doctor calendar:', err);
            onError(err.message || 'Failed to load doctor calendar');
        } finally {
            onLoading(false);
        }
    };

    const getDefaultName = () => {
        if (isDoctor && user?.firstName && user?.lastName)
            return `${user.firstName} ${user.lastName}`;
        return '';
    };

    return (
        <div className="doctor-calendar-section">
            <div className="section-header">
                <h3>Doctor Calendar View</h3>
                <p>View a doctor's schedule and appointments</p>
            </div>

            <CalendarForm
                onSubmit={handleCalendarSubmit}
                nameLabel="Doctor Name"
                namePlaceholder="Enter doctor name"
                defaultName={getDefaultName()}
                buttonText="Load Calendar"
                searchType="doctor"
            />

            {calendarView && (
                <CalendarResults
                    calendarView={calendarView}
                    type="doctor"
                />
            )}
        </div>
    );
}

export default DoctorCalendarTab;