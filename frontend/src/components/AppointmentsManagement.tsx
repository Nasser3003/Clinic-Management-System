import React, {useEffect, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import Layout from './Layout';
import './css/AppointmentsManagement.css';
import HeroHeader from "./common/HeroHeader";
import {appointmentService} from '../services/appointmentService';
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

interface AppointmentFilters {
    status: string;
    doctorName: string;
    patientName: string;
    startDate: string;
    endDate: string;
}

function AppointmentsManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'create' | 'all' | 'doctor-calendar' | 'patient-calendar'>('create');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [calendarView, setCalendarView] = useState<CalendarView | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState<AppointmentFilters>({
        status: '',
        doctorName: '',
        patientName: '',
        startDate: '',
        endDate: ''
    });

    const isAdmin = user?.userType === 'ADMIN';
    const isDoctor = user?.userType === 'DOCTOR';
    const isEmployee = ['NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user?.userType || '');
    const isPatient = user?.userType === 'PATIENT';

    useEffect(() => {
        if (activeTab === 'all')
            loadAllAppointments();
    }, [activeTab, filters]);

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const loadAllAppointments = async () => {
        setLoading(true);
        clearMessages();

        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            // Convert names to emails for API filtering using searchService
            if (filters.doctorName) {
                try {
                    const { searchService } = await import('../services/searchService');
                    const doctorResults = await searchService.searchDoctors(filters.doctorName, 1);
                    if (doctorResults.results.length > 0)
                        params.append('doctorEmail', doctorResults.results[0].email);
                } catch (err) {
                    console.warn('Doctor name not found for filtering:', filters.doctorName);
                }
            }

            if (filters.patientName) {
                try {
                    const { searchService } = await import('../services/searchService');
                    const patientResults = await searchService.searchPatients(filters.patientName, 1);
                    if (patientResults.results.length > 0)
                        params.append('patientEmail', patientResults.results[0].email);
                } catch (err) {
                    console.warn('Patient name not found for filtering:', filters.patientName);
                }
            }

            const queryString = params.toString();
            const url = `/api/appointments${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                throw new Error('Failed to load appointments');
            }
        } catch (err: any) {
            console.error('Error loading appointments:', err);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    const cancelAppointment = async (appointmentId: string) => {
        try {
            await appointmentService.cancelAppointment(appointmentId);
            setSuccess('Appointment cancelled successfully');
            loadAllAppointments();
        } catch (err: any) {
            console.error('Error cancelling appointment:', err);
            setError('Failed to cancel appointment');
        }
    };

    const completeAppointment = async (appointmentId: string) => {
        try {
            const response = await fetch(`/appointments/${appointmentId}/complete`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    notes: '',
                    prescription: ''
                })
            });

            if (response.ok) {
                setSuccess('Appointment completed successfully');
                loadAllAppointments();
            } else {
                throw new Error('Failed to complete appointment');
            }
        } catch (err: any) {
            console.error('Error completing appointment:', err);
            setError('Failed to complete appointment');
        }
    };

    const handleAppointmentCreated = () => {
        setSuccess('Appointment scheduled successfully!');
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
                            loading={loading}
                            filters={filters}
                            setFilters={setFilters}
                            isAdmin={isAdmin}
                            isEmployee={isEmployee}
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