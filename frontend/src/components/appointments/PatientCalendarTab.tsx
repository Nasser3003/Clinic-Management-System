import React from 'react';
import { User } from '../../types/auth';
import { Appointment } from '../../types/appointment';
import { searchService } from '../../services/searchService';
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
    const loadPatientCalendar = async (patientName: string, startDate: string, endDate: string) => {
        onLoading(true);

        try {
            // Search for patient by name using searchService
            const patientResults = await searchService.searchPatients(patientName, 1);
            if (patientResults.results.length === 0)
                throw new Error('Patient not found with that name');

            const patientEmail = patientResults.results[0].email;

            // Make API call for patient calendar
            const response = await fetch(
                `/api/calendar/patient/${patientEmail}?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                onCalendarLoaded(data);
            } else {
                throw new Error('Failed to load patient calendar');
            }
        } catch (err: any) {
            console.error('Error loading patient calendar:', err);
            onError('Failed to load patient calendar');
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

        loadPatientCalendar(name, startDate, endDate);
    };

    const getDefaultName = () => {
        if (isPatient && user?.firstName && user?.lastName)
            return `${user.firstName} ${user.lastName}`;
        return '';
    };

    const getDefaultStartDate = () => {
        return new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    };

    const getDefaultEndDate = () => {
        return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
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
                defaultStartDate={getDefaultStartDate()}
                defaultEndDate={getDefaultEndDate()}
                buttonText="Load Calendar"
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