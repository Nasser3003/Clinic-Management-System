import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import Layout from './Layout';
import './css/AppointmentsManagement.css';
import HeroHeader from "./common/HeroHeader";
import api from '../services/api';
import CreateAppointmentTab from './appointments/CreateAppointmentTab';
import AllAppointmentsTab from './appointments/AllAppointmentsTab';
import DoctorCalendarTab from './appointments/DoctorCalendarTab';
import PatientCalendarTab from "./appointments/PatientCalendarTab";
import TabNavigation from "./appointments/TabNavigation";
import {Appointment} from '../types/appointment';

interface CalendarView {
    doctorName?: string;
    doctorEmail?: string;
    patientEmail?: string;
    startDate: string;
    endDate: string;
    appointments: Appointment[];
}

function AppointmentsManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'create' | 'all' | 'doctor-calendar' | 'patient-calendar'>('create');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [calendarView, setCalendarView] = useState<CalendarView | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const isAdmin = user?.userType === 'ADMIN';
    const isDoctor = user?.userType === 'DOCTOR';
    const isEmployee = ['NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user?.userType || '');
    const isPatient = user?.userType === 'PATIENT';

    // Load all appointments when the 'all' tab is opened
    useEffect(() => {
        if (activeTab === 'all')
            loadAllAppointments();
    }, [activeTab]);

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const loadAllAppointments = async () => {
        setLoading(true);
        clearMessages();

        try {
            const response = await api.get('/appointments/all');
            setAppointments(response.data);
        } catch (err: any) {
            console.error('Error loading appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId: string) => {
        try {
            await api.post(`/appointments/cancel?uuid=${appointmentId}`);
            setSuccess('Appointment cancelled successfully');
            loadAllAppointments();
        } catch (err: any) {
            console.error('Error cancelling appointment:', err);
            setError('Failed to cancel appointment');
        }
    };

    const completeAppointment = async (appointmentId: string) => {
        try {
            await api.patch(`/appointments/${appointmentId}/complete`, {
                treatments: []
            });
            setSuccess('Appointment completed successfully');
            loadAllAppointments();
        } catch (err: any) {
            console.error('Error completing appointment:', err);
            setError('Failed to complete appointment');
        }
    };

    const handleAppointmentCreated = () => {
        setSuccess('Appointment scheduled successfully!');
        // Refresh appointments if we're on the all tab
        if (activeTab === 'all')
            loadAllAppointments();
    };

    const handleCalendarLoaded = (data: CalendarView) => {
        setCalendarView(data);
    };

    const handleError = (errorMessage: string) => {
        setError(errorMessage);
    };

    const handleLoading = (isLoading: boolean) => {
        setLoading(isLoading);
    };

    return (
        <Layout>
            <HeroHeader
                title="Appointments Management"
                subtitle="Schedule and manage appointments in the system"
            />

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {success && (
                <div className="success-message">
                    {success}
                </div>
            )}

            <TabNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isAdmin={isAdmin}
                isEmployee={isEmployee}
                isDoctor={isDoctor}
            />

            <div className="tab-content">
                {activeTab === 'create' && (isAdmin || isEmployee || isDoctor) && (
                    <CreateAppointmentTab
                        user={user}
                        isDoctor={isDoctor}
                        loading={loading}
                        onAppointmentCreated={handleAppointmentCreated}
                        onError={handleError}
                        onLoading={handleLoading}
                        clearMessages={clearMessages}
                    />
                )}

                {activeTab === 'all' && (
                    <AllAppointmentsTab
                        appointments={appointments}
                        isAdmin={isAdmin}
                        isDoctor={isDoctor}
                        onCancelAppointment={cancelAppointment}
                        onCompleteAppointment={completeAppointment}
                    />
                )}

                {activeTab === 'doctor-calendar' && (
                    <DoctorCalendarTab
                        calendarView={calendarView}
                        loading={loading}
                        isDoctor={isDoctor}
                        user={user}
                        onCalendarLoaded={handleCalendarLoaded}
                        onError={handleError}
                        onLoading={handleLoading}
                    />
                )}

                {activeTab === 'patient-calendar' && (
                    <PatientCalendarTab
                        calendarView={calendarView}
                        loading={loading}
                        isPatient={isPatient}
                        user={user}
                        onCalendarLoaded={handleCalendarLoaded}
                        onError={handleError}
                        onLoading={handleLoading}
                    />
                )}
            </div>
        </Layout>
    );
}

export default AppointmentsManagement;