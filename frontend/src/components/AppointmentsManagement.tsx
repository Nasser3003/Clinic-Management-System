import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/AppointmentsManagement.css';
import HeroHeader from "./common/HeroHeader";
import { searchService, SearchResult } from '../services/searchService';
import { appointmentService } from '../services/appointmentService';

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

interface AppointmentForm {
    doctorName: string;
    patientName: string;
    duration: number;
    dateTime: string;
}

function AppointmentsManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'create' | 'all' | 'doctor-calendar' | 'patient-calendar'>('create');
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [calendarView, setCalendarView] = useState<CalendarView | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
        doctorName: '',
        patientName: '',
        duration: 60,
        dateTime: ''
    });
    const [filters, setFilters] = useState({
        status: '',
        doctorName: '',
        patientName: '',
        startDate: '',
        endDate: ''
    });

    // Autocomplete states
    const [doctorSuggestions, setDoctorSuggestions] = useState<SearchResult[]>([]);
    const [patientSuggestions, setPatientSuggestions] = useState<SearchResult[]>([]);
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const [searchingDoctors, setSearchingDoctors] = useState(false);
    const [searchingPatients, setSearchingPatients] = useState(false);
    const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');
    const [selectedPatientEmail, setSelectedPatientEmail] = useState('');

    // Refs for handling clicks outside
    const doctorInputRef = useRef<HTMLDivElement>(null);
    const patientInputRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.userType === 'ADMIN';
    const isDoctor = user?.userType === 'DOCTOR';
    const isEmployee = ['NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user?.userType || '');
    const isPatient = user?.userType === 'PATIENT';

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (doctorInputRef.current && !doctorInputRef.current.contains(event.target as Node)) {
                setShowDoctorDropdown(false);
            }
            if (patientInputRef.current && !patientInputRef.current.contains(event.target as Node)) {
                setShowPatientDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search doctors with debouncing
    useEffect(() => {
        if (appointmentForm.doctorName.length >= 2) {
            const timeoutId = setTimeout(async () => {
                setSearchingDoctors(true);
                try {
                    const results = await searchService.searchDoctors(appointmentForm.doctorName, 5);
                    setDoctorSuggestions(results.results);
                    setShowDoctorDropdown(true);
                } catch (err) {
                    console.error('Error searching doctors:', err);
                    setDoctorSuggestions([]);
                }
                setSearchingDoctors(false);
            }, 300);

            return () => clearTimeout(timeoutId);
        } else {
            setDoctorSuggestions([]);
            setShowDoctorDropdown(false);
        }
    }, [appointmentForm.doctorName]);

    // Search patients with debouncing
    useEffect(() => {
        if (appointmentForm.patientName.length >= 2) {
            const timeoutId = setTimeout(async () => {
                setSearchingPatients(true);
                try {
                    const results = await searchService.searchPatients(appointmentForm.patientName, 5);
                    setPatientSuggestions(results.results);
                    setShowPatientDropdown(true);
                } catch (err) {
                    console.error('Error searching patients:', err);
                    setPatientSuggestions([]);
                }
                setSearchingPatients(false);
            }, 300);

            return () => clearTimeout(timeoutId);
        } else {
            setPatientSuggestions([]);
            setShowPatientDropdown(false);
        }
    }, [appointmentForm.patientName]);

    // Handle doctor selection
    const handleDoctorSelect = (doctor: SearchResult) => {
        setAppointmentForm(prev => ({
            ...prev,
            doctorName: `${doctor.firstName} ${doctor.lastName}`
        }));
        setSelectedDoctorEmail(doctor.email);
        setShowDoctorDropdown(false);
    };

    // Handle patient selection
    const handlePatientSelect = (patient: SearchResult) => {
        setAppointmentForm(prev => ({
            ...prev,
            patientName: `${patient.firstName} ${patient.lastName}`
        }));
        setSelectedPatientEmail(patient.email);
        setShowPatientDropdown(false);
    };

    // Auto-fill doctor name if user is a doctor
    useEffect(() => {
        if (isDoctor && user?.firstName && user?.lastName) {
            const doctorName = `${user.firstName} ${user.lastName}`;
            setAppointmentForm(prev => ({
                ...prev,
                doctorName
            }));
            setSelectedDoctorEmail(user.email);
        }
    }, [isDoctor, user]);

    useEffect(() => {
        if (activeTab === 'all')
            loadAllAppointments();
    }, [activeTab, filters]);

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const createAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        clearMessages();

        try {
            let doctorEmail = selectedDoctorEmail;
            let patientEmail = selectedPatientEmail;

            // If no email selected (user typed without selecting), search for exact match
            if (!doctorEmail && appointmentForm.doctorName) {
                const doctorResults = await searchService.searchDoctors(appointmentForm.doctorName, 1);
                if (doctorResults.results.length === 0) {
                    throw new Error('Doctor not found with that name. Please select from the dropdown suggestions.');
                }
                doctorEmail = doctorResults.results[0].email;
            }

            if (!patientEmail && appointmentForm.patientName) {
                const patientResults = await searchService.searchPatients(appointmentForm.patientName, 1);
                if (patientResults.results.length === 0) {
                    throw new Error('Patient not found with that name. Please select from the dropdown suggestions.');
                }
                patientEmail = patientResults.results[0].email;
            }

            if (!doctorEmail || !patientEmail) {
                throw new Error('Please select both doctor and patient from the dropdown suggestions.');
            }

            // Format datetime for backend
            const formattedDateTime = new Date(appointmentForm.dateTime)
                .toISOString()
                .slice(0, 19)
                .replace('T', ' ');

            // Use the appointmentService to schedule
            await appointmentService.scheduleAppointment({
                doctorEmail,
                patientEmail,
                dateTime: formattedDateTime,
                duration: appointmentForm.duration
            });

            setSuccess('Appointment scheduled successfully!');
            // Clear form
            setAppointmentForm({
                doctorName: isDoctor && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
                patientName: '',
                duration: 60,
                dateTime: ''
            });
            setSelectedDoctorEmail(isDoctor && user?.email ? user.email : '');
            setSelectedPatientEmail('');
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            setError(err.message || 'Failed to schedule appointment');
        } finally {
            setLoading(false);
        }
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
                    const doctorResults = await searchService.searchDoctors(filters.doctorName, 1);
                    if (doctorResults.results.length > 0) {
                        params.append('doctorEmail', doctorResults.results[0].email);
                    }
                } catch (err) {
                    console.warn('Doctor name not found for filtering:', filters.doctorName);
                }
            }

            if (filters.patientName) {
                try {
                    const patientResults = await searchService.searchPatients(filters.patientName, 1);
                    if (patientResults.results.length > 0) {
                        params.append('patientEmail', patientResults.results[0].email);
                    }
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

    const loadDoctorCalendar = async (doctorName: string, startDate: string, endDate: string) => {
        setLoading(true);
        clearMessages();

        try {
            // Search for doctor by name using searchService
            const doctorResults = await searchService.searchDoctors(doctorName, 1);
            if (doctorResults.results.length === 0) {
                throw new Error('Doctor not found with that name');
            }

            const doctorEmail = doctorResults.results[0].email;

            // Use appointmentService to get doctor calendar
            const data = await appointmentService.getDoctorCalendar(doctorEmail, startDate, endDate);
            setCalendarView(data);
        } catch (err: any) {
            console.error('Error loading doctor calendar:', err);
            setError('Failed to load doctor calendar');
        } finally {
            setLoading(false);
        }
    };

    const loadPatientCalendar = async (patientName: string, startDate: string, endDate: string) => {
        setLoading(true);
        clearMessages();

        try {
            // Search for patient by name using searchService
            const patientResults = await searchService.searchPatients(patientName, 1);
            if (patientResults.results.length === 0) {
                throw new Error('Patient not found with that name');
            }

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

    const cancelAppointment = async (appointmentId: string) => {
        try {
            const response = await fetch('/appointments/cancel', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: appointmentId
            });

            if (response.ok) {
                setSuccess('Appointment cancelled successfully');
                loadAllAppointments();
            } else {
                throw new Error('Failed to cancel appointment');
            }
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
                    // Add any required completion data here
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
        const name = formData.get('name') as string;
        const startDate = formData.get('startDate') as string;
        const endDate = formData.get('endDate') as string;

        if (type === 'doctor') {
            loadDoctorCalendar(name, startDate, endDate);
        } else {
            loadPatientCalendar(name, startDate, endDate);
        }
    };

    const clearForm = () => {
        setAppointmentForm({
            doctorName: isDoctor && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
            patientName: '',
            duration: 60,
            dateTime: ''
        });
        setSelectedDoctorEmail(isDoctor && user?.email ? user.email : '');
        setSelectedPatientEmail('');
        clearMessages();
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <Layout>
            <div className="appointments-management">
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

                {/* Tab Navigation */}
                <div className="tabs-container">
                    <div className="tabs-header">
                        {(isAdmin || isEmployee || isDoctor) && (
                            <button
                                className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                                onClick={() => setActiveTab('create')}
                            >
                                Create Appointment
                            </button>
                        )}
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
                    {/* Create Appointment Tab */}
                    {activeTab === 'create' && (isAdmin || isEmployee || isDoctor) && (
                        <div className="create-appointment-section">
                            <div className="section-header">
                                <h3>Schedule New Appointment</h3>
                                <p>Create a new appointment for a patient</p>
                            </div>

                            <form onSubmit={createAppointment} className="appointment-form">
                                <div className="form-group">
                                    <label htmlFor="doctorName">Doctor Name</label>
                                    <div className="autocomplete-container" ref={doctorInputRef}>
                                        <input
                                            id="doctorName"
                                            type="text"
                                            className="form-input"
                                            value={appointmentForm.doctorName}
                                            onChange={(e) => {
                                                setAppointmentForm(prev => ({ ...prev, doctorName: e.target.value }));
                                                setSelectedDoctorEmail('');
                                            }}
                                            placeholder="Enter doctor name"
                                            required
                                            disabled={isDoctor}
                                            autoComplete="off"
                                        />
                                        {showDoctorDropdown && (
                                            <div className="autocomplete-dropdown">
                                                {searchingDoctors ? (
                                                    <div className="autocomplete-loading">Searching...</div>
                                                ) : doctorSuggestions.length > 0 ? (
                                                    doctorSuggestions.map((doctor) => (
                                                        <div
                                                            key={doctor.id}
                                                            className="autocomplete-item"
                                                            onClick={() => handleDoctorSelect(doctor)}
                                                        >
                                                            <div className="autocomplete-item-name">
                                                                {doctor.firstName} {doctor.lastName}
                                                            </div>
                                                            <div className="autocomplete-item-details">
                                                                {doctor.email}
                                                                {doctor.speciality && ` • ${doctor.speciality}`}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="autocomplete-no-results">No doctors found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="patientName">Patient Name</label>
                                    <div className="autocomplete-container" ref={patientInputRef}>
                                        <input
                                            id="patientName"
                                            type="text"
                                            className="form-input"
                                            value={appointmentForm.patientName}
                                            onChange={(e) => {
                                                setAppointmentForm(prev => ({ ...prev, patientName: e.target.value }));
                                                setSelectedPatientEmail('');
                                            }}
                                            placeholder="Enter patient name"
                                            required
                                            autoComplete="off"
                                        />
                                        {showPatientDropdown && (
                                            <div className="autocomplete-dropdown">
                                                {searchingPatients ? (
                                                    <div className="autocomplete-loading">Searching...</div>
                                                ) : patientSuggestions.length > 0 ? (
                                                    patientSuggestions.map((patient) => (
                                                        <div
                                                            key={patient.id}
                                                            className="autocomplete-item"
                                                            onClick={() => handlePatientSelect(patient)}
                                                        >
                                                            <div className="autocomplete-item-name">
                                                                {patient.firstName} {patient.lastName}
                                                            </div>
                                                            <div className="autocomplete-item-details">
                                                                {patient.email}
                                                                {patient.phone && ` • ${patient.phone}`}
                                                            </div>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="autocomplete-no-results">No patients found</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="duration">Duration (minutes)</label>
                                    <select
                                        id="duration"
                                        className="form-select"
                                        value={appointmentForm.duration}
                                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                                        required
                                    >
                                        <option value={30}>30 minutes</option>
                                        <option value={60}>60 minutes</option>
                                        <option value={90}>90 minutes</option>
                                        <option value={120}>120 minutes</option>
                                        <option value={150}>150 minutes</option>
                                        <option value={180}>180 minutes</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dateTime">Date & Time</label>
                                    <input
                                        id="dateTime"
                                        type="datetime-local"
                                        className="form-input"
                                        value={appointmentForm.dateTime}
                                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, dateTime: e.target.value }))}
                                        min={getCurrentDateTime()}
                                        required
                                    />
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={clearForm}
                                        className="clear-btn"
                                    >
                                        Clear Form
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="create-btn"
                                    >
                                        {loading ? 'Scheduling...' : 'Schedule Appointment'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* All Appointments Tab */}
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
                                                <label>Doctor Name</label>
                                                <input
                                                    type="text"
                                                    value={filters.doctorName}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, doctorName: e.target.value }))}
                                                    placeholder="Filter by doctor name"
                                                    className="filter-input"
                                                />
                                            </div>

                                            <div className="filter-group">
                                                <label>Patient Name</label>
                                                <input
                                                    type="text"
                                                    value={filters.patientName}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, patientName: e.target.value }))}
                                                    placeholder="Filter by patient name"
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
                                            doctorName: '',
                                            patientName: '',
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
                                                <td data-label="Date & Time">
                                                    <div className="appointment-time">
                                                            <span className="start-time">
                                                                {formatDateTime(appointment.startDateTime)}
                                                            </span>
                                                        <span className="end-time">
                                                                to {new Date(appointment.endDateTime).toLocaleTimeString()}
                                                            </span>
                                                    </div>
                                                </td>
                                                <td data-label="Doctor">{appointment.doctorName}</td>
                                                <td data-label="Patient">{appointment.patientName}</td>
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
                                                                    onClick={() => completeAppointment(appointment.id)}
                                                                    className="complete-btn"
                                                                >
                                                                    Complete
                                                                </button>
                                                                <button
                                                                    onClick={() => cancelAppointment(appointment.id)}
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
                            )}
                        </div>
                    )}

                    {/* Doctor Calendar Tab */}
                    {activeTab === 'doctor-calendar' && (
                        <div className="doctor-calendar-section">
                            <div className="section-header">
                                <h3>Doctor Calendar View</h3>
                                <p>View a doctor's schedule and appointments</p>
                            </div>

                            <form onSubmit={(e) => handleCalendarSubmit(e, 'doctor')} className="calendar-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Doctor Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Enter doctor name"
                                            className="form-input"
                                            defaultValue={isDoctor && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
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
                                                            <div>
                                                                <h5>{appointment.patientName}</h5>
                                                                <p className="appointment-time">
                                                                    {formatDateTime(appointment.startDateTime)} -
                                                                    {new Date(appointment.endDateTime).toLocaleTimeString()}
                                                                </p>
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
                            )}
                        </div>
                    )}

                    {/* Patient Calendar Tab */}
                    {activeTab === 'patient-calendar' && (
                        <div className="patient-calendar-section">
                            <div className="section-header">
                                <h3>Patient Calendar View</h3>
                                <p>View a patient's appointment history</p>
                            </div>

                            <form onSubmit={(e) => handleCalendarSubmit(e, 'patient')} className="calendar-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Patient Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="Enter patient name"
                                            className="form-input"
                                            defaultValue={isPatient && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : ''}
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
                                        <h4>Appointments for {calendarView.patientEmail || 'Patient'}</h4>
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
                                                                <h5>Dr. {appointment.doctorName}</h5>
                                                                <p className="appointment-time">
                                                                    {formatDateTime(appointment.startDateTime)} -
                                                                    {new Date(appointment.endDateTime).toLocaleTimeString()}
                                                                </p>
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
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default AppointmentsManagement;