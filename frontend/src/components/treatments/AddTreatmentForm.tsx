import React, { useEffect, useState, useRef } from 'react';
import { SearchResult, searchService } from '../../services/searchService';
import AutocompleteDropdown from '../AutoCompleteDropdown';

interface TreatmentManagement {
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    installmentPeriodInMonths: number;
}

interface TreatmentFormData {
    appointmentId: string;
    treatments: TreatmentManagement[];
}

interface SubmitData {
    appointmentId: string;
    formData: FormData;
    resetForm: () => void;
}

interface Appointment {
    id: string;
    patientName: string;
    doctorName: string;
    startDateTime: string;
    status: string;
    duration: number;
}

interface AddTreatmentFormProps {
    isAdmin: boolean;
    isDoctor: boolean;
    isEmployee: boolean;
    currentUser: any;
    onSubmit: (data: SubmitData) => Promise<void>;
    submitting: boolean;
}

function AddTreatmentForm({
                              isAdmin,
                              isDoctor,
                              isEmployee,
                              currentUser,
                              onSubmit,
                              submitting
                          }: AddTreatmentFormProps) {
    const [selectedPatient, setSelectedPatient] = useState<SearchResult | null>(null);
    const [selectedDoctor, setSelectedDoctor] = useState<SearchResult | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

    // Patient search states
    const [patientSearchQuery, setPatientSearchQuery] = useState('');
    const [patientSuggestions, setPatientSuggestions] = useState<SearchResult[]>([]);
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const [searchingPatients, setSearchingPatients] = useState(false);

    // Doctor search states
    const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
    const [doctorSuggestions, setDoctorSuggestions] = useState<SearchResult[]>([]);
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [searchingDoctors, setSearchingDoctors] = useState(false);

    // Appointment search states
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loadingAppointments, setLoadingAppointments] = useState(false);

    // Refs for click outside handling
    const patientInputRef = useRef<HTMLDivElement>(null);
    const doctorInputRef = useRef<HTMLDivElement>(null);

    const [treatmentForm, setTreatmentForm] = useState<TreatmentFormData>({
        appointmentId: '',
        treatments: [
            {
                treatmentDescription: '',
                cost: 0,
                amountPaid: 0,
                installmentPeriodInMonths: 0
            }
        ]
    });

    const [patientNotes, setPatientNotes] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (patientInputRef.current && !patientInputRef.current.contains(event.target as Node))
                setShowPatientDropdown(false);
            if (doctorInputRef.current && !doctorInputRef.current.contains(event.target as Node))
                setShowDoctorDropdown(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Set doctor for doctor users
    useEffect(() => {
        if (isDoctor && currentUser) {
            setSelectedDoctor({
                id: currentUser.id || currentUser.email,
                email: currentUser.email,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                role: 'DOCTOR'
            });
        }
    }, [isDoctor, currentUser]);

    // Search patients with debouncing
    useEffect(() => {
        if (patientSearchQuery.length >= 2 && !selectedPatient) {
            const timeoutId = setTimeout(async () => {
                setSearchingPatients(true);
                try {
                    const results = await searchService.searchPatients(patientSearchQuery, 5);
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
    }, [patientSearchQuery, selectedPatient]);

    // Search doctors with debouncing (only for admin/employee users)
    useEffect(() => {
        if (doctorSearchQuery.length >= 2 && !selectedDoctor && !isDoctor) {
            const timeoutId = setTimeout(async () => {
                setSearchingDoctors(true);
                try {
                    const results = await searchService.searchDoctors(doctorSearchQuery, 5);
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
    }, [doctorSearchQuery, selectedDoctor, isDoctor]);

    // Load appointments when both patient and doctor are selected
    useEffect(() => {
        if (selectedPatient && selectedDoctor) {
            loadAppointments();
        } else {
            setAppointments([]);
            setSelectedAppointment(null);
        }
    }, [selectedPatient, selectedDoctor]);

    // Update appointment ID when appointment is selected
    useEffect(() => {
        if (selectedAppointment) {
            setTreatmentForm(prev => ({
                ...prev,
                appointmentId: selectedAppointment.id
            }));
        } else {
            setTreatmentForm(prev => ({
                ...prev,
                appointmentId: ''
            }));
        }
    }, [selectedAppointment]);

    const loadAppointments = async () => {
        if (!selectedPatient || !selectedDoctor) return;

        setLoadingAppointments(true);
        try {
            const response = await fetch(`/api/appointments?patientEmail=${selectedPatient.email}&doctorEmail=${selectedDoctor.email}&status=COMPLETED`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setAppointments(data);
            } else {
                console.error('Failed to load appointments');
                setAppointments([]);
            }
        } catch (err) {
            console.error('Error loading appointments:', err);
            setAppointments([]);
        } finally {
            setLoadingAppointments(false);
        }
    };

    // Handle patient selection
    const handlePatientSelect = (patient: SearchResult) => {
        setSelectedPatient(patient);
        setPatientSearchQuery('');
        setShowPatientDropdown(false);
        setPatientSuggestions([]);
        // Reset appointment when patient changes
        setSelectedAppointment(null);
    };

    // Handle doctor selection
    const handleDoctorSelect = (doctor: SearchResult) => {
        setSelectedDoctor(doctor);
        setDoctorSearchQuery('');
        setShowDoctorDropdown(false);
        setDoctorSuggestions([]);
        // Reset appointment when doctor changes
        setSelectedAppointment(null);
    };

    // Handle patient input change
    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatientSearchQuery(e.target.value);
        if (selectedPatient) {
            setSelectedPatient(null);
            setSelectedAppointment(null);
        }
    };

    // Handle doctor input change
    const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDoctorSearchQuery(e.target.value);
        if (selectedDoctor) {
            setSelectedDoctor(null);
            setSelectedAppointment(null);
        }
    };

    // Clear patient selection
    const handleClearPatient = () => {
        setSelectedPatient(null);
        setPatientSearchQuery('');
        setPatientSuggestions([]);
        setShowPatientDropdown(false);
        setSelectedAppointment(null);
    };

    // Clear doctor selection
    const handleClearDoctor = () => {
        setSelectedDoctor(null);
        setDoctorSearchQuery('');
        setDoctorSuggestions([]);
        setShowDoctorDropdown(false);
        setSelectedAppointment(null);
    };

    const handleAddTreatment = () => {
        setTreatmentForm(prev => ({
            ...prev,
            treatments: [
                ...prev.treatments,
                {
                    treatmentDescription: '',
                    cost: 0,
                    amountPaid: 0,
                    installmentPeriodInMonths: 0
                }
            ]
        }));
    };

    const handleRemoveTreatment = (index: number) => {
        if (treatmentForm.treatments.length > 1) {
            setTreatmentForm(prev => ({
                ...prev,
                treatments: prev.treatments.filter((_, i) => i !== index)
            }));
        }
    };

    const handleTreatmentChange = (index: number, field: keyof TreatmentManagement, value: string | number) => {
        setTreatmentForm(prev => ({
            ...prev,
            treatments: prev.treatments.map((treatment, i) =>
                i === index ? { ...treatment, [field]: value } : treatment
            )
        }));
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setUploadedFiles(prev => [...prev, ...files]);
        }
    };

    const handleRemoveFile = (index: number) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmitTreatments = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!treatmentForm.appointmentId) {
            throw new Error('Please select an appointment');
        }

        if (treatmentForm.treatments.some(t => !t.treatmentDescription.trim())) {
            throw new Error('Please provide description for all treatments');
        }

        if (treatmentForm.treatments.some(t => t.cost <= 0)) {
            throw new Error('Treatment cost must be greater than 0');
        }

        if (treatmentForm.treatments.some(t => t.amountPaid < 0)) {
            throw new Error('Amount paid cannot be negative');
        }

        if (treatmentForm.treatments.some(t => t.amountPaid > t.cost)) {
            throw new Error('Amount paid cannot exceed treatment cost');
        }

        const formData = new FormData();
        formData.append('treatments', JSON.stringify(treatmentForm.treatments));
        if (patientNotes.trim()) formData.append('patientNotes', patientNotes);

        uploadedFiles.forEach((file, index) => {
            formData.append(`file_${index}`, file);
        });

        await onSubmit({
            appointmentId: treatmentForm.appointmentId,
            formData,
            resetForm: () => {
                setTreatmentForm({
                    appointmentId: '',
                    treatments: [{
                        treatmentDescription: '',
                        cost: 0,
                        amountPaid: 0,
                        installmentPeriodInMonths: 0
                    }]
                });
                setPatientNotes('');
                setUploadedFiles([]);
                setSelectedAppointment(null);
                setPatientSearchQuery('');
                setDoctorSearchQuery('');
                if (!isDoctor) {
                    setSelectedPatient(null);
                    setSelectedDoctor(null);
                }
            }
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getPatientDisplayValue = () => {
        if (selectedPatient)
            return `${selectedPatient.firstName} ${selectedPatient.lastName}`;
        return patientSearchQuery;
    };

    const getDoctorDisplayValue = () => {
        if (selectedDoctor)
            return `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`;
        return doctorSearchQuery;
    };

    return (
        <div className="add-treatment-section">
            <div className="section-header">
                <h3>Add Treatment Record</h3>
                <p>Add treatment details for a completed appointment</p>
            </div>

            {/* Patient and Doctor Selection using AutocompleteDropdown */}
            <div className="selection-section">
                {/* Doctor Selection */}
                {isDoctor ? (
                    <div className="search-group">
                        <label>
                            Select Doctor
                            <span className="required-indicator">*</span>
                        </label>
                        <div className="search-container" ref={doctorInputRef}>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    value={getDoctorDisplayValue()}
                                    onChange={handleDoctorInputChange}
                                    placeholder="Search for a doctor..."
                                    className="form-input"
                                    autoComplete="off"
                                    readOnly={!!selectedDoctor}
                                    required
                                />
                                {selectedDoctor && (
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
                ) : (
                    <div className="search-group">
                        <label>
                            Select Doctor
                            <span className="required-indicator">*</span>
                        </label>
                        <div className="search-container" ref={doctorInputRef}>
                            <div className="search-input-wrapper">
                                <input
                                    type="text"
                                    value={getDoctorDisplayValue()}
                                    onChange={handleDoctorInputChange}
                                    placeholder="Search for a doctor..."
                                    className="form-input"
                                    autoComplete="off"
                                    readOnly={!!selectedDoctor}
                                    required
                                />
                                {selectedDoctor && (
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
                )}

                {/* Patient Selection */}
                <div className="search-group">
                    <label>
                        Select Patient
                        <span className="required-indicator">*</span>
                    </label>
                    <div className="search-container" ref={patientInputRef}>
                        <div className="search-input-wrapper">
                            <input
                                type="text"
                                value={getPatientDisplayValue()}
                                onChange={handlePatientInputChange}
                                placeholder="Search for a patient..."
                                className="form-input"
                                autoComplete="off"
                                readOnly={!!selectedPatient}
                                required
                            />
                            {selectedPatient && (
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

            <form onSubmit={handleSubmitTreatments} className="treatment-form">
                {/* Appointment Selection */}
                <div className="appointment-search-autocomplete">
                    <label className="search-label">
                        <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        Select Appointment
                        <span className="required-indicator">*</span>
                    </label>
                    <div className="appointment-select-wrapper">
                        <select
                            value={selectedAppointment?.id || ''}
                            onChange={(e) => {
                                const appointmentId = e.target.value;
                                const appointment = appointments.find(apt => apt.id === appointmentId);
                                setSelectedAppointment(appointment || null);
                            }}
                            className="appointment-select"
                            disabled={!selectedPatient || !selectedDoctor || loadingAppointments}
                            required
                        >
                            <option value="">
                                {!selectedPatient || !selectedDoctor
                                    ? 'Select patient and doctor first'
                                    : loadingAppointments
                                        ? 'Loading appointments...'
                                        : appointments.length === 0
                                            ? 'No completed appointments found'
                                            : 'Choose an appointment'
                                }
                            </option>
                            {appointments.map((appointment) => (
                                <option key={appointment.id} value={appointment.id}>
                                    {formatDateTime(appointment.startDateTime)} - {appointment.duration} min
                                </option>
                            ))}
                        </select>
                        {loadingAppointments && (
                            <div className="appointment-loading">
                                <div className="loading-spinner" style={{ width: '1rem', height: '1rem', border: '2px solid #e5e7eb', borderTop: '2px solid #3b82f6' }}></div>
                            </div>
                        )}
                    </div>
                    {appointments.length > 0 && (
                        <div className="appointment-count">
                            {appointments.length} completed appointment{appointments.length !== 1 ? 's' : ''} available
                        </div>
                    )}
                </div>

                {/* Treatment Details */}
                <div className="treatments-section">
                    <div className="treatments-header">
                        <h4>Treatment Details</h4>
                    </div>

                    {treatmentForm.treatments.map((treatment, index) => (
                        <div key={index} className="treatment-item">
                            <div className="treatment-item-header">
                                <h5>Treatment {index + 1}</h5>
                                {treatmentForm.treatments.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTreatment(index)}
                                        className="remove-treatment-btn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>

                            <div className="form-row">
                                <div className="form-group full-width">
                                    <label>Treatment Description</label>
                                    <textarea
                                        value={treatment.treatmentDescription}
                                        onChange={(e) => handleTreatmentChange(index, 'treatmentDescription', e.target.value)}
                                        placeholder="Describe the treatment provided..."
                                        required
                                        className="form-textarea compact"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Total Cost ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={treatment.cost}
                                        onChange={(e) => handleTreatmentChange(index, 'cost', parseFloat(e.target.value) || 0)}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Amount Paid ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        max={treatment.cost}
                                        value={treatment.amountPaid}
                                        onChange={(e) => handleTreatmentChange(index, 'amountPaid', parseFloat(e.target.value) || 0)}
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Installment Period (Months)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={treatment.installmentPeriodInMonths}
                                        onChange={(e) => handleTreatmentChange(index, 'installmentPeriodInMonths', parseInt(e.target.value) || 0)}
                                        className="form-input"
                                        placeholder="0 for one-time payment"
                                    />
                                </div>
                            </div>

                            {treatment.cost > 0 && (
                                <div className="cost-summary">
                                    <span>Remaining Balance: {formatCurrency(treatment.cost - treatment.amountPaid)}</span>
                                </div>
                            )}
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={handleAddTreatment}
                        className="add-treatment-btn"
                    >
                        Add Another Treatment
                    </button>
                </div>

                {/* Notes and Files Section */}
                <div className="notes-files-container">
                    {/* Notes Section */}
                    <div className="notes-section">
                        <h4>Patient Notes</h4>
                        <textarea
                            value={patientNotes}
                            onChange={(e) => setPatientNotes(e.target.value)}
                            placeholder="Add any additional notes for the patient..."
                            className="notes-textarea"
                        />
                    </div>

                    {/* File Upload Section */}
                    <div className="files-section">
                        <h4>Attach Files</h4>
                        <div className="file-upload-area">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt"
                                className="file-input"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="file-upload-label">
                                <svg className="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Choose Files
                                <span className="file-types">PDF, Images, Documents</span>
                            </label>
                        </div>

                        {uploadedFiles.length > 0 && (
                            <div className="uploaded-files">
                                {uploadedFiles.map((file, index) => (
                                    <div key={index} className="file-item">
                                        <div className="file-info">
                                            <svg className="file-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                            <span className="file-name">{file.name}</span>
                                        </div>
                                        <span className="file-size">({Math.round(file.size / 1024)}KB)</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveFile(index)}
                                            className="remove-file-btn"
                                            title="Remove file"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        disabled={submitting || !treatmentForm.appointmentId}
                        className="submit-btn"
                    >
                        {submitting ? 'Adding Treatments...' : 'Add Treatments'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTreatmentForm;