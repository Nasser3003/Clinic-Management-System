import React, { useState, useEffect, useRef } from 'react';
import { searchService, SearchResult } from '../../services/searchService';
import { appointmentService } from '../../services/appointmentService';
import { User } from '../../types/auth';
import AutocompleteDropdown from "../AutoCompleteDropdown";

interface AppointmentForm {
    doctorName: string;
    patientName: string;
    duration: number;
    dateTime: string;
    reason: string;
}

interface AppointmentRequestDTO {
    doctorEmail: string;
    patientEmail: string;
    dateTime: string;
    duration: number;
    reason: string;
}

interface CreateAppointmentTabProps {
    user: User | null;
    isDoctor: boolean;
    loading: boolean;
    onAppointmentCreated: () => void;
    onError: (error: string) => void;
    onLoading: (loading: boolean) => void;
    clearMessages: () => void;
}

function CreateAppointmentTab({
                                  user,
                                  isDoctor,
                                  loading,
                                  onAppointmentCreated,
                                  onError,
                                  onLoading,
                                  clearMessages
                              }: CreateAppointmentTabProps) {
    const [appointmentForm, setAppointmentForm] = useState<AppointmentForm>({
        doctorName: '',
        patientName: '',
        duration: 60,
        dateTime: '',
        reason: ''
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

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (doctorInputRef.current && !doctorInputRef.current.contains(event.target as Node))
                setShowDoctorDropdown(false);
            if (patientInputRef.current && !patientInputRef.current.contains(event.target as Node))
                setShowPatientDropdown(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search doctors with debouncing
    useEffect(() => {
        if (appointmentForm.doctorName.length >= 2 && !selectedDoctorEmail) {
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
    }, [appointmentForm.doctorName, selectedDoctorEmail]);

    // Search patients with debouncing
    useEffect(() => {
        if (appointmentForm.patientName.length >= 2 && !selectedPatientEmail) {
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
    }, [appointmentForm.patientName, selectedPatientEmail]);

    // Handle doctor selection
    const handleDoctorSelect = (doctor: SearchResult) => {
        setAppointmentForm(prev => ({
            ...prev,
            doctorName: `${doctor.firstName} ${doctor.lastName}`
        }));
        setSelectedDoctorEmail(doctor.email);
        setShowDoctorDropdown(false);
        setDoctorSuggestions([]);
    };

    // Handle patient selection
    const handlePatientSelect = (patient: SearchResult) => {
        setAppointmentForm(prev => ({
            ...prev,
            patientName: `${patient.firstName} ${patient.lastName}`
        }));
        setSelectedPatientEmail(patient.email);
        setShowPatientDropdown(false);
        setPatientSuggestions([]);
    };

    // Handle doctor input change
    const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAppointmentForm(prev => ({ ...prev, doctorName: e.target.value }));
        if (selectedDoctorEmail)
            setSelectedDoctorEmail('');
    };

    // Handle patient input change
    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAppointmentForm(prev => ({ ...prev, patientName: e.target.value }));
        if (selectedPatientEmail)
            setSelectedPatientEmail('');
    };

    // Clear doctor selection
    const handleClearDoctor = () => {
        setAppointmentForm(prev => ({ ...prev, doctorName: '' }));
        setSelectedDoctorEmail('');
        setDoctorSuggestions([]);
        setShowDoctorDropdown(false);
    };

    // Clear patient selection
    const handleClearPatient = () => {
        setAppointmentForm(prev => ({ ...prev, patientName: '' }));
        setSelectedPatientEmail('');
        setPatientSuggestions([]);
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

    // Format datetime to match backend expected format
    const formatDateTimeForBackend = (dateTimeString: string): string => {
        const date = new Date(dateTimeString);
        return date.toISOString().slice(0, 19).replace('T', ' ');
    };

    const createAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        onLoading(true);
        clearMessages();

        try {
            let doctorEmail = selectedDoctorEmail;
            let patientEmail = selectedPatientEmail;

            // Validate required fields
            if (!appointmentForm.reason.trim())
                throw new Error('Please provide a reason for the appointment.');

            if (!appointmentForm.dateTime)
                throw new Error('Please select date and time for the appointment.');

            // If no email selected (user typed without selecting), search for the exact match
            if (!doctorEmail && appointmentForm.doctorName) {
                const doctorResults = await searchService.searchDoctors(appointmentForm.doctorName, 1);
                if (doctorResults.results.length === 0)
                    throw new Error('Doctor not found with that name. Please select from the dropdown suggestions.');
                doctorEmail = doctorResults.results[0].email;
            }

            if (!patientEmail && appointmentForm.patientName) {
                const patientResults = await searchService.searchPatients(appointmentForm.patientName, 1);
                if (patientResults.results.length === 0)
                    throw new Error('Patient not found with that name. Please select from the dropdown suggestions.');
                patientEmail = patientResults.results[0].email;
            }

            if (!doctorEmail || !patientEmail)
                throw new Error('Please select both doctor and patient from the dropdown suggestions.');

            const appointmentRequest: AppointmentRequestDTO = {
                doctorEmail,
                patientEmail,
                dateTime: formatDateTimeForBackend(appointmentForm.dateTime),
                duration: appointmentForm.duration,
                reason: appointmentForm.reason.trim()
            };

            await appointmentService.scheduleAppointment(appointmentRequest);

            onAppointmentCreated();
            clearForm();
        } catch (err: any) {
            console.error('Error creating appointment:', err);
            onError(err.message || 'Failed to schedule appointment');
        } finally {
            onLoading(false);
        }
    };

    const clearForm = () => {
        setAppointmentForm({
            doctorName: isDoctor && user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '',
            patientName: '',
            duration: 60,
            dateTime: '',
            reason: ''
        });
        setSelectedDoctorEmail(isDoctor && user?.email ? user.email : '');
        setSelectedPatientEmail('');
        setDoctorSuggestions([]);
        setPatientSuggestions([]);
        setShowDoctorDropdown(false);
        setShowPatientDropdown(false);
        clearMessages();
    };

    const getCurrentDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    return (
        <div className="create-appointment-section">
            <div className="section-header">
                <h3>Schedule New Appointment</h3>
                <p>Create a new appointment for a patient</p>
            </div>

            <form onSubmit={createAppointment} className="appointment-form">
                {/* Top Row: Doctor and Patient Names */}
                <div className="form-grid">
                    <div className="form-group">
                        <label htmlFor="doctorName">Doctor Name</label>
                        <div className="autocomplete-container" ref={doctorInputRef}>
                            <div className="search-input-wrapper">
                                <input
                                    id="doctorName"
                                    type="text"
                                    className="form-input"
                                    value={appointmentForm.doctorName}
                                    onChange={handleDoctorInputChange}
                                    placeholder="Enter doctor name"
                                    required
                                    readOnly={!!selectedDoctorEmail}
                                    autoComplete="off"
                                />
                                {selectedDoctorEmail && (
                                    <button
                                        type="button"
                                        onClick={handleClearDoctor}
                                        className="clear-search-btn"
                                        title="Clear selection"
                                    >
                                        <svg className="clear-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <AutocompleteDropdown
                                suggestions={doctorSuggestions}
                                isSearching={searchingDoctors}
                                isVisible={showDoctorDropdown}
                                onSelect={handleDoctorSelect}
                                type="doctor"
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="patientName">Patient Name</label>
                        <div className="autocomplete-container" ref={patientInputRef}>
                            <div className="search-input-wrapper">
                                <input
                                    id="patientName"
                                    type="text"
                                    className="form-input"
                                    value={appointmentForm.patientName}
                                    onChange={handlePatientInputChange}
                                    placeholder="Enter patient name"
                                    required
                                    readOnly={!!selectedPatientEmail}
                                    autoComplete="off"
                                />
                                {selectedPatientEmail && (
                                    <button
                                        type="button"
                                        onClick={handleClearPatient}
                                        className="clear-search-btn"
                                        title="Clear selection"
                                    >
                                        <svg className="clear-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd"
                                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                                  clipRule="evenodd"></path>
                                        </svg>
                                    </button>
                                )}
                            </div>
                            <AutocompleteDropdown
                                suggestions={patientSuggestions}
                                isSearching={searchingPatients}
                                isVisible={showPatientDropdown}
                                onSelect={handlePatientSelect}
                                type="patient"
                            />
                        </div>
                    </div>
                </div>

                {/* Middle Row: Date/Time and Duration */}
                <div className="form-grid-bottom">
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
                </div>

                {/* Bottom Row: Reason */}
                <div className="form-group full-width">
                    <label htmlFor="reason">Reason for Appointment</label>
                    <textarea
                        id="reason"
                        className="form-textarea"
                        value={appointmentForm.reason}
                        onChange={(e) => setAppointmentForm(prev => ({ ...prev, reason: e.target.value }))}
                        placeholder="Enter the reason for this appointment (e.g., Regular checkup, Follow-up, Consultation)"
                        required
                        rows={3}
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
    );
}

export default CreateAppointmentTab;