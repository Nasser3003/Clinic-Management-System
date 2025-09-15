import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import Layout from '../../Layout';
import './../../css/AppointmentsManagement.css';

interface Appointment {
    id: string;
    doctorName: string;
    patientName: string;
    startDateTime: string;
    endDateTime: string;
    duration: number;
    status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    isDone: boolean;
    doctorEmail?: string;
    patientEmail?: string;
}

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
    const [activeTab, setActiveTab] = useState<'all' | 'doctor-calendar' | 'patient-calendar'>('all');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [calendarView, setCalendarView] = useState<CalendarView | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        status: '',
        doctorEmail: '',
        patientEmail: '',
        startDate: '',
        endDate: ''
    });

    const isAdmin = user?.role === 'ADMIN';
    const isDoctor = user?.role === 'DOCTOR';
    const isEmployee = ['NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user?.role || '');
    const isPatient = user?.role === 'PATIENT';

    useEffect(() => {
        if (activeTab === 'all') {
            loadAllAppointments();
        }
    }, [activeTab, filters]);

    const loadAllAppointments = async () => {
        setLoading(true);
        setError('');

        try {
            // Build query parameters
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.doctorEmail) params.append('doctorEmail', filters.doctorEmail);
            if (filters.patientEmail) params.append('patientEmail', filters.patientEmail);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

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

    const loadDoctorCalendar = async (doctorEmail: string, startDate: string, endDate: string) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(
                `/api/calendar/doctor/${doctorEmail}?startDate=${startDate}&endDate=${endDate}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.ok) {
                const data = await response.json();
                setCalendarView(data);
            } else {
                throw new Error('Failed to load doctor calendar');
            }
        } catch (err: any) {
            console.error('Error loading doctor calendar:', err);
            setError('Failed to load doctor calendar');
        } finally {
            setLoading(false);
        }
    };

    const loadPatientCalendar = async (patientEmail: string, startDate: string, endDate: string) => {
        setLoading(true);
        setError('');

        try {
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
                setCalendarView(data);
            } else {
                throw new Error('Failed to load patient calendar');
            }
        } catch (err: any) {
            console.error('Error loading patient calendar:', err);
            setError('Failed to load patient calendar');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateAppointmentStatus = async (appointmentId: string, status: 'COMPLETED' | 'CANCELLED') => {
        try {
            const response = await fetch(`/api/appointments/${appointmentId}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            if (response.ok) {
                loadAllAppointments();
            } else {
                throw new Error('Failed to update appointment status');
            }
        } catch (err: any) {
            console.error('Error updating appointment status:', err);
            setError('Failed to update appointment status');
        }
    };

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

    const handleCalendarSubmit = (e: React.FormEvent, type: 'doctor' | 'patient') => {
        e.preventDefault();
        const formData = new FormData(e.target as HTMLFormElement);
        const email = formData.get('email') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;

        if (type === 'doctor') {
            loadDoctorCalendar(email, startDate, endDate);
        } else {
            loadPatientCalendar(email, startDate, endDate);
        }
    };

    return (
        <Layout>
                <div className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Appointments Management</h1>
                        <p className="hero-subtitle">iew and manage all appointments in the system</p>
                    </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <div className="tabs-header">
                        <button
                            className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                            onClick={() => setActiveTab('all')}
                        >
                            All Appointments
                        </button>
                        {(isAdmin || isEmployee || isDoctor) && (
                            <button
                                className={`tab-button ${activeTab === 'doctor-calendar' ? 'active' : ''}`}
                                onClick={() => setActiveTab('doctor-calendar')}
                            >
                                Doctor Calendar
                            </button>
                        )}
                        {(isAdmin || isEmployee) && (
                            <button
                                className={`tab-button ${activeTab === 'patient-calendar' ? 'active' : ''}`}
                                onClick={() => setActiveTab('patient-calendar')}
                            >
                                Patient Calendar
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'all' && (
                        <div className="all-appointments-section">
                            <div className="section-header">
                                <h3>All Appointments</h3>
                                <p>View and filter all appointments in the system</p>
                            </div>

                            {/* Filters */}
                            <div className="filters-section">
                                <div className="filters-grid">
                                    <div className="filter-group">
                                        <label>Status</label>
                                        <select
                                            value={filters.status}
                                            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                                            className="filter-select"
                                        >
                                            <option value="">All Statuses</option>
                                            <option value="SCHEDULED">Scheduled</option>
                                            <option value="COMPLETED">Completed</option>
                                            <option value="CANCELLED">Cancelled</option>
                                        </select>
                                    </div>

                                    {(isAdmin || isEmployee) && (
                                        <>
                                            <div className="filter-group">
                                                <label>Doctor Email</label>
                                                <input
                                                    type="email"
                                                    value={filters.doctorEmail}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, doctorEmail: e.target.value }))}
                                                    placeholder="Filter by doctor email"
                                                    className="filter-input"
                                                />
                                            </div>

                                            <div className="filter-group">
                                                <label>Patient Email</label>
                                                <input
                                                    type="email"
                                                    value={filters.patientEmail}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, patientEmail: e.target.value }))}
                                                    placeholder="Filter by patient email"
                                                    className="filter-input"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="filter-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="filter-input"
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                            className="filter-input"
                                        />
                                    </div>
                                </div>

                                <div className="filter-actions">
                                    <button
                                        onClick={() => setFilters({
                                            status: '',
                                            doctorEmail: '',
                                            patientEmail: '',
                                            startDate: '',
                                            endDate: ''
                                        })}
                                        className="clear-filters-btn"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>

                            {/* Appointments List */}
                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <p>Loading appointments...</p>
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="empty-state">
                                    <p>No appointments found with the current filters</p>
                                </div>
                            ) : (
                                <div className="appointments-table">
                                    <table className="appointments-grid">
                                        <thead>
                                            <tr>
                                                <th>Date & Time</th>
                                                <th>Doctor</th>
                                                <th>Patient</th>
                                                <th>Duration</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.map((appointment) => (
                                                <tr key={appointment.id}>
                                                    <td>
                                                        <div className="appointment-time">
                                                            <span className="start-time">
                                                                {formatDateTime(appointment.startDateTime)}
                                                            </span>
                                                            <span className="end-time">
                                                                to {new Date(appointment.endDateTime).toLocaleTimeString()}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>{appointment.doctorName}</td>
                                                    <td>{appointment.patientName}</td>
                                                    <td>{appointment.duration} min</td>
                                                    <td>
                                                        <span className={`status-badge ${getStatusColor(appointment.status)}`}>
                                                            {appointment.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="appointment-actions">
                                                            {appointment.status === 'SCHEDULED' && (isDoctor || isAdmin) && (
                                                                <>
                                                                    <button
                                                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'COMPLETED')}
                                                                        className="complete-btn"
                                                                    >
                                                                        Complete
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleUpdateAppointmentStatus(appointment.id, 'CANCELLED')}
                                                                        className="cancel-btn"
                                                                    >
                                                                        Cancel
                                                                    </button>
                                                                </>
                                                            )}
                                                            <button className="view-details-btn">
                                                                View Details
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'doctor-calendar' && (
                        <div className="doctor-calendar-section">
                            <div className="section-header">
                                <h3>Doctor Calendar View</h3>
                                <p>View a doctor's schedule and appointments</p>
                            </div>

                            <form onSubmit={(e) => handleCalendarSubmit(e, 'doctor')} className="calendar-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Doctor Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Enter doctor email"
                                            className="form-input"
                                            defaultValue={isDoctor ? user?.email : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            required
                                            className="form-input"
                                            defaultValue={new Date().toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            required
                                            className="form-input"
                                            defaultValue={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="load-calendar-btn">
                                    {loading ? 'Loading...' : 'Load Calendar'}
                                </button>
                            </form>

                            {calendarView && (
                                <div className="calendar-results">
                                    <div className="calendar-header">
                                        <h4>Calendar for {calendarView.doctorName}</h4>
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
                                                            <h5>{appointment.patientName}</h5>
                                                            <p className="appointment-time">
                                                                {formatDateTime(appointment.startDateTime)} - 
                                                                {new Date(appointment.endDateTime).toLocaleTimeString()}
                                                            </p>
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
                            )}
                        </div>
                    )}

                    {activeTab === 'patient-calendar' && (
                        <div className="patient-calendar-section">
                            <div className="section-header">
                                <h3>Patient Calendar View</h3>
                                <p>View a patient's appointment history</p>
                            </div>

                            <form onSubmit={(e) => handleCalendarSubmit(e, 'patient')} className="calendar-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Patient Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Enter patient email"
                                            className="form-input"
                                            defaultValue={isPatient ? user?.email : ''}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Start Date</label>
                                        <input
                                            type="date"
                                            name="startDate"
                                            required
                                            className="form-input"
                                            defaultValue={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>End Date</label>
                                        <input
                                            type="date"
                                            name="endDate"
                                            required
                                            className="form-input"
                                            defaultValue={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                                        />
                                    </div>
                                </div>
                                <button type="submit" disabled={loading} className="load-calendar-btn">
                                    {loading ? 'Loading...' : 'Load Calendar'}
                                </button>
                            </form>

                            {calendarView && (
                                <div className="calendar-results">
                                    <div className="calendar-header">
                                        <h4>Appointments for {calendarView.patientEmail}</h4>
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
                                                            <h5>Dr. {appointment.doctorName}</h5>
                                                            <p className="appointment-time">
                                                                {formatDateTime(appointment.startDateTime)} - 
                                                                {new Date(appointment.endDateTime).toLocaleTimeString()}
                                                            </p>
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
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default AppointmentsManagement;