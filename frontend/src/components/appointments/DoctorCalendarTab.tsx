import React from 'react';
import { User } from '../../types/auth';
import { Appointment } from '../../types/appointment';
import { searchService } from '../../services/searchService';
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
    const loadDoctorCalendar = async (doctorName: string, startDate: string, endDate: string) => {
        onLoading(true);

        try {
            // Search for doctor by name using searchService
            const doctorResults = await searchService.searchDoctors(doctorName, 1);
            if (doctorResults.results.length === 0)
                throw new Error('Doctor not found with that name');

            const doctorEmail = doctorResults.results[0].email;

            // Use appointmentService to get doctor calendar
            const data = await appointmentService.getDoctorCalendar(doctorEmail, startDate, endDate);
            onCalendarLoaded(data);
        } catch (err: any) {
            console.error('Error loading doctor calendar:', err);
            onError('Failed to load doctor calendar');
        } finally {
            onLoading(false);
        }
    };

    const handleCalendarSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const name = formData.get('name') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;

        loadDoctorCalendar(name, startDate, endDate);
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
                loading={loading}
                nameLabel="Doctor Name"
                namePlaceholder="Enter doctor name"
                defaultName={getDefaultName()}
                buttonText="Load Calendar"
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