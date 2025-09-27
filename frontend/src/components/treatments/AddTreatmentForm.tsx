import React, {useEffect, useRef, useState} from 'react';
import {SearchResult, searchService} from '../../services/searchService';
import AutocompleteDropdown from '../AutoCompleteDropdown';

interface Prescription {
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
}

interface TreatmentManagement {
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    installmentPeriodInMonths: number;
    prescriptions: Prescription[];
}

interface TreatmentFormData {
    appointmentId: string;
    treatments: TreatmentManagement[];
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
    submitting: boolean;
    onSuccess?: () => void;
}

function AddTreatmentForm({
                              isAdmin,
                              isDoctor,
                              isEmployee,
                              currentUser,
                              submitting,
                              onSuccess
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

    // Form states
    const [treatmentForm, setTreatmentForm] = useState<TreatmentFormData>({
        appointmentId: '',
        treatments: [{
            treatmentDescription: '',
            cost: 0,
            amountPaid: 0,
            installmentPeriodInMonths: 0,
            prescriptions: []
        }]
    });

    // UI States
    const [activeTreatmentIndex, setActiveTreatmentIndex] = useState(0);
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [editingPrescriptionIndex, setEditingPrescriptionIndex] = useState<number | null>(null);
    const [expandedPrescriptions, setExpandedPrescriptions] = useState<Set<number>>(new Set());
    const [currentPrescription, setCurrentPrescription] = useState<Prescription>({
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: ''
    });

    const [patientNotes, setPatientNotes] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Refs for click outside handling
    const patientInputRef = useRef<HTMLDivElement>(null);
    const doctorInputRef = useRef<HTMLDivElement>(null);

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
            const response = await fetch('http://localhost:3001/appointments/search/doctor-patient/scheduled', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    doctorEmail: selectedDoctor.email,
                    patientEmail: selectedPatient.email,
                    statusEnum: 'SCHEDULED',
                    startDate: null,
                    endDate: null
                })
            });

            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setAppointments(data);
                    setSelectedAppointment(data[0]);
                } else {
                    setAppointments([]);
                    setSelectedAppointment(null);
                }
            } else {
                console.error('Failed to load appointments');
                setAppointments([]);
                setSelectedAppointment(null);
            }
        } catch (err) {
            console.error('Error loading appointments:', err);
            setAppointments([]);
            setSelectedAppointment(null);
        } finally {
            setLoadingAppointments(false);
        }
    };

    const handlePatientSelect = (patient: SearchResult) => {
        setSelectedPatient(patient);
        setPatientSearchQuery('');
        setShowPatientDropdown(false);
        setPatientSuggestions([]);
        setSelectedAppointment(null);
    };

    const handleDoctorSelect = (doctor: SearchResult) => {
        setSelectedDoctor(doctor);
        setDoctorSearchQuery('');
        setShowDoctorDropdown(false);
        setDoctorSuggestions([]);
        setSelectedAppointment(null);
    };

    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatientSearchQuery(e.target.value);
        if (selectedPatient) {
            setSelectedPatient(null);
            setSelectedAppointment(null);
        }
    };

    const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDoctorSearchQuery(e.target.value);
        if (selectedDoctor) {
            setSelectedDoctor(null);
            setSelectedAppointment(null);
        }
    };

    const handleClearPatient = () => {
        setSelectedPatient(null);
        setPatientSearchQuery('');
        setPatientSuggestions([]);
        setShowPatientDropdown(false);
        setSelectedAppointment(null);
    };

    const handleClearDoctor = () => {
        setSelectedDoctor(null);
        setDoctorSearchQuery('');
        setDoctorSuggestions([]);
        setShowDoctorDropdown(false);
        setSelectedAppointment(null);
    };

    const handleAddTreatment = () => {
        const newIndex = treatmentForm.treatments.length;
        setTreatmentForm(prev => ({
            ...prev,
            treatments: [
                ...prev.treatments,
                {
                    treatmentDescription: '',
                    cost: 0,
                    amountPaid: 0,
                    installmentPeriodInMonths: 0,
                    prescriptions: []
                }
            ]
        }));
        setActiveTreatmentIndex(newIndex);
    };

    const handleRemoveTreatment = (index: number) => {
        if (treatmentForm.treatments.length > 1) {
            setTreatmentForm(prev => ({
                ...prev,
                treatments: prev.treatments.filter((_, i) => i !== index)
            }));
            // Adjust active treatment index if needed
            if (index === activeTreatmentIndex && index > 0) {
                setActiveTreatmentIndex(index - 1);
            } else if (index < activeTreatmentIndex) {
                setActiveTreatmentIndex(activeTreatmentIndex - 1);
            }
        }
    };

    const handleTreatmentChange = (index: number, field: keyof Omit<TreatmentManagement, 'prescriptions'>, value: string | number) => {
        setTreatmentForm(prev => ({
            ...prev,
            treatments: prev.treatments.map((treatment, i) =>
                i === index ? { ...treatment, [field]: value } : treatment
            )
        }));
    };

    const handleSelectTreatment = (index: number) => {
        setActiveTreatmentIndex(index);
        setShowPrescriptionForm(false);
        setEditingPrescriptionIndex(null);
    };

    // Prescription handlers
    const handleShowPrescriptionForm = () => {
        setCurrentPrescription({
            medicationName: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        });
        setEditingPrescriptionIndex(null);
        setShowPrescriptionForm(true);
    };

    const handleEditPrescription = (prescriptionIndex: number) => {
        const prescription = treatmentForm.treatments[activeTreatmentIndex].prescriptions[prescriptionIndex];
        setCurrentPrescription(prescription);
        setEditingPrescriptionIndex(prescriptionIndex);
        setShowPrescriptionForm(true);
    };

    const handleSavePrescription = () => {
        if (!currentPrescription.medicationName.trim()) return;

        setTreatmentForm(prev => ({
            ...prev,
            treatments: prev.treatments.map((treatment, i) =>
                i === activeTreatmentIndex
                    ? {
                        ...treatment,
                        prescriptions: editingPrescriptionIndex !== null
                            ? treatment.prescriptions.map((p, j) =>
                                j === editingPrescriptionIndex ? currentPrescription : p
                            )
                            : [...treatment.prescriptions, currentPrescription]
                    }
                    : treatment
            )
        }));

        setShowPrescriptionForm(false);
        setEditingPrescriptionIndex(null);
        setCurrentPrescription({
            medicationName: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        });
    };

    const handleCancelPrescription = () => {
        setShowPrescriptionForm(false);
        setEditingPrescriptionIndex(null);
        setCurrentPrescription({
            medicationName: '',
            dosage: '',
            frequency: '',
            duration: '',
            instructions: ''
        });
    };

    const handleDeletePrescription = (prescriptionIndex: number) => {
        setTreatmentForm(prev => ({
            ...prev,
            treatments: prev.treatments.map((treatment, i) =>
                i === activeTreatmentIndex
                    ? {
                        ...treatment,
                        prescriptions: treatment.prescriptions.filter((_, j) => j !== prescriptionIndex)
                    }
                    : treatment
            )
        }));

        // Remove from expanded set
        setExpandedPrescriptions(prev => {
            const newSet = new Set(prev);
            newSet.delete(prescriptionIndex);
            return newSet;
        });
    };

    const togglePrescriptionExpansion = (prescriptionIndex: number) => {
        setExpandedPrescriptions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(prescriptionIndex)) {
                newSet.delete(prescriptionIndex);
            } else {
                newSet.add(prescriptionIndex);
            }
            return newSet;
        });
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

    const resetForm = () => {
        setTreatmentForm({
            appointmentId: '',
            treatments: [{
                treatmentDescription: '',
                cost: 0,
                amountPaid: 0,
                installmentPeriodInMonths: 0,
                prescriptions: []
            }]
        });
        setPatientNotes('');
        setUploadedFiles([]);
        setSelectedAppointment(null);
        setPatientSearchQuery('');
        setDoctorSearchQuery('');
        setActiveTreatmentIndex(0);
        setShowPrescriptionForm(false);
        setEditingPrescriptionIndex(null);
        setExpandedPrescriptions(new Set());
        if (!isDoctor) {
            setSelectedPatient(null);
            setSelectedDoctor(null);
        }
        setSubmitError(null);
    };

    const validateForm = () => {
        if (!treatmentForm.appointmentId)
            throw new Error('Please select an appointment');

        if (treatmentForm.treatments.some(t => !t.treatmentDescription.trim()))
            throw new Error('Please provide description for all treatments');

        if (treatmentForm.treatments.some(t => t.cost <= 0))
            throw new Error('Treatment cost must be greater than 0');

        if (treatmentForm.treatments.some(t => t.amountPaid < 0))
            throw new Error('Amount paid cannot be negative');

        if (treatmentForm.treatments.some(t => t.amountPaid > t.cost))
            throw new Error('Amount paid cannot exceed treatment cost');

        // Validate prescriptions for each treatment
        treatmentForm.treatments.forEach((treatment, treatmentIndex) => {
            const filledPrescriptions = treatment.prescriptions.filter(p =>
                p.medicationName.trim() || p.dosage.trim() || p.frequency.trim() || p.duration.trim()
            );

            if (filledPrescriptions.some(p => !p.medicationName.trim()))
                throw new Error(`Please provide medication name for all prescriptions in Treatment ${treatmentIndex + 1}`);

            if (filledPrescriptions.some(p => !p.dosage.trim()))
                throw new Error(`Please provide dosage for all prescriptions in Treatment ${treatmentIndex + 1}`);

            if (filledPrescriptions.some(p => !p.frequency.trim()))
                throw new Error(`Please provide frequency for all prescriptions in Treatment ${treatmentIndex + 1}`);

            if (filledPrescriptions.some(p => !p.duration.trim()))
                throw new Error(`Please provide duration for all prescriptions in Treatment ${treatmentIndex + 1}`);
        });
    };

    const handleSubmitTreatments = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError(null);

        try {
            validateForm();

            const formData = new FormData();

            // Convert frontend prescriptions to backend format
            const convertPrescription = (prescription: Prescription) => ({
                name: prescription.medicationName,  // Change medicationName to name
                dosage: prescription.dosage,
                duration: prescription.duration,
                frequency: prescription.frequency,
                instructions: prescription.instructions
            });

            // Prepare treatments with their prescriptions embedded
            const treatmentsForBackend = treatmentForm.treatments.map(treatment => ({
                treatmentDescription: treatment.treatmentDescription,
                cost: treatment.cost,
                amountPaid: treatment.amountPaid,
                installmentPeriodInMonths: treatment.installmentPeriodInMonths,
                // Include prescriptions inside each treatment
                prescriptions: treatment.prescriptions
                    .filter(p => p.medicationName.trim()) // Only include prescriptions with medication names
                    .map(convertPrescription)
            }));

            // Create the DTO structure that matches your backend TreatmentDetailsDTO
            const treatmentData = {
                treatments: treatmentsForBackend,
                // Remove the separate prescriptions array - they're now embedded in treatments
                filePaths: [], // Will be populated by backend
                visitNotes: patientNotes.trim() || null
            };

            console.log('Sending treatment data:', treatmentData); // Debug log

            // Add JSON data as a blob
            formData.append('data', new Blob([JSON.stringify(treatmentData)], {
                type: 'application/json'
            }));

            // Add files
            uploadedFiles.forEach((file) => {
                formData.append('files', file);
            });

            setIsSubmitting(true);

            const response = await fetch(`http://localhost:3001/appointments/${treatmentForm.appointmentId}/complete`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                resetForm();
                onSuccess?.();
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to add treatment');
            }
        } catch (error) {
            console.error('Error submitting treatment:', error);
            setSubmitError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
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

    const getPrescriptionSummary = (prescription: Prescription) => {
        return (
            <div className="prescription-details-brief">
                <div className="prescription-detail-item">
                    <span className="prescription-detail-label">Dosage</span>
                    <span className="prescription-detail-value">{prescription.dosage}</span>
                </div>
                <div className="prescription-detail-item">
                    <span className="prescription-detail-label">Frequency</span>
                    <span className="prescription-detail-value">{prescription.frequency}</span>
                </div>
                <div className="prescription-detail-item">
                    <span className="prescription-detail-label">Duration</span>
                    <span className="prescription-detail-value">{prescription.duration}</span>
                </div>
            </div>
        );
    };

    const activeTreatment = treatmentForm.treatments[activeTreatmentIndex];

    return (
        <div className="add-treatment-section">
            <div className="section-header">
                <h3>Add Treatment Record</h3>
                <p>Add treatment details for a completed appointment</p>
            </div>

            {submitError && (
                <div className="error-message">
                    {submitError}
                </div>
            )}

            {/* Patient and Doctor Selection */}
            <div className="selection-section">
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
                                readOnly={!!selectedDoctor || isDoctor}
                                required
                            />
                            {selectedDoctor && !isDoctor && (
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
                        {!isDoctor && (
                            <AutocompleteDropdown
                                suggestions={doctorSuggestions}
                                isSearching={searchingDoctors}
                                isVisible={showDoctorDropdown}
                                onSelect={handleDoctorSelect}
                                type="doctor"
                            />
                        )}
                    </div>
                </div>

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
                                            ? 'No scheduled appointments found'
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
                            {appointments.length} scheduled appointment{appointments.length !== 1 ? 's' : ''} available
                        </div>
                    )}
                </div>

                {/* Two-Column Treatment Layout */}
                <div className="treatment-layout">
                    {/* Left Panel: Treatments */}
                    <div className="treatment-panel">
                        <div className="panel-header">
                            📋 Treatments
                            <button
                                type="button"
                                onClick={handleAddTreatment}
                                className="add-treatment-btn-header"
                            >
                                Add Treatment
                            </button>
                        </div>

                        {treatmentForm.treatments.map((treatment, index) => (
                            <div
                                key={index}
                                className={`treatment-card ${index === activeTreatmentIndex ? 'active' : ''}`}
                                onClick={() => handleSelectTreatment(index)}
                            >
                                <div className="treatment-card-header">
                                    <div className="treatment-title">Treatment {index + 1}</div>
                                    {treatmentForm.treatments.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRemoveTreatment(index);
                                            }}
                                            className="remove-treatment-btn-small"
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="treatment-description">
                                    <textarea
                                        value={treatment.treatmentDescription}
                                        onChange={(e) => handleTreatmentChange(index, 'treatmentDescription', e.target.value)}
                                        placeholder="Describe the treatment..."
                                        className="form-textarea compact"
                                        rows={3}
                                        required
                                        onFocus={() => handleSelectTreatment(index)}
                                    />
                                </div>

                                <div className="treatment-meta">
                                    <div className="cost-grid">
                                        <div className="cost-field">
                                            <label>Cost ($)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                value={treatment.cost}
                                                onChange={(e) => handleTreatmentChange(index, 'cost', parseFloat(e.target.value) || 0)}
                                                className="form-input small"
                                                required
                                                onFocus={() => handleSelectTreatment(index)}
                                            />
                                        </div>
                                        <div className="cost-field">
                                            <label>Paid ($)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                max={treatment.cost}
                                                value={treatment.amountPaid}
                                                onChange={(e) => handleTreatmentChange(index, 'amountPaid', parseFloat(e.target.value) || 0)}
                                                className="form-input small"
                                                onFocus={() => handleSelectTreatment(index)}
                                            />
                                        </div>
                                        <div className="cost-field">
                                            <label>Installments</label>
                                            <input
                                                type="number"
                                                min="0"
                                                value={treatment.installmentPeriodInMonths}
                                                onChange={(e) => handleTreatmentChange(index, 'installmentPeriodInMonths', parseInt(e.target.value) || 0)}
                                                className="form-input small"
                                                placeholder="0"
                                                onFocus={() => handleSelectTreatment(index)}
                                            />
                                        </div>
                                    </div>
                                    {treatment.cost > 0 && (
                                        <div className="balance-display">
                                            Balance: {formatCurrency(treatment.cost - treatment.amountPaid)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Right Panel: Prescriptions */}
                    <div className="prescription-panel">
                        <div className="panel-header">
                            💊 Prescriptions for Treatment {activeTreatmentIndex + 1}
                        </div>

                        {/* Add Prescription Form */}
                        {showPrescriptionForm && (
                            <div className="prescription-form">
                                <div className="prescription-form-header">
                                    <h6>{editingPrescriptionIndex !== null ? 'Edit Prescription' : 'Add New Prescription'}</h6>
                                </div>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Medication Name</label>
                                        <input
                                            type="text"
                                            value={currentPrescription.medicationName}
                                            onChange={(e) => setCurrentPrescription(prev => ({ ...prev, medicationName: e.target.value }))}
                                            placeholder="Enter medication..."
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Dosage</label>
                                        <input
                                            type="text"
                                            value={currentPrescription.dosage}
                                            onChange={(e) => setCurrentPrescription(prev => ({ ...prev, dosage: e.target.value }))}
                                            placeholder="e.g., 500mg"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Frequency</label>
                                        <input
                                            type="text"
                                            value={currentPrescription.frequency}
                                            onChange={(e) => setCurrentPrescription(prev => ({ ...prev, frequency: e.target.value }))}
                                            placeholder="e.g., 2x daily"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            value={currentPrescription.duration}
                                            onChange={(e) => setCurrentPrescription(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="e.g., 7 days"
                                            className="form-input"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Special Instructions</label>
                                    <textarea
                                        value={currentPrescription.instructions || ''}
                                        onChange={(e) => setCurrentPrescription(prev => ({ ...prev, instructions: e.target.value }))}
                                        placeholder="Additional instructions..."
                                        className="form-textarea compact"
                                        rows={2}
                                    />
                                </div>
                                <div className="form-actions">
                                    <button
                                        type="button"
                                        onClick={handleCancelPrescription}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSavePrescription}
                                        className="btn-primary"
                                    >
                                        {editingPrescriptionIndex !== null ? 'Update Prescription' : 'Save Prescription'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Existing Prescriptions */}
                        <div className="prescriptions-list">
                            {activeTreatment.prescriptions.map((prescription, prescriptionIndex) => (
                                <div key={prescriptionIndex} className="prescription-item">
                                    <div
                                        className="prescription-header"
                                        onClick={() => togglePrescriptionExpansion(prescriptionIndex)}
                                    >
                                        <div className="prescription-header-top">
                                            <div className="prescription-name-section">
                                                <span className={`expand-arrow ${expandedPrescriptions.has(prescriptionIndex) ? 'expanded' : ''}`}>
                                                    ▶
                                                </span>
                                                <div className="prescription-name">{prescription.medicationName}</div>
                                            </div>
                                            <div className="prescription-actions" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    type="button"
                                                    onClick={() => handleEditPrescription(prescriptionIndex)}
                                                    className="btn-small btn-edit"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeletePrescription(prescriptionIndex)}
                                                    className="btn-small btn-delete"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                        {getPrescriptionSummary(prescription)}
                                    </div>
                                    <div className={`prescription-details ${expandedPrescriptions.has(prescriptionIndex) ? 'expanded' : ''}`}>
                                        {prescription.instructions && (
                                            <div className="prescription-instructions">
                                                <div className="prescription-instructions-label">Special Instructions</div>
                                                <div className="prescription-instructions-value">{prescription.instructions}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!showPrescriptionForm && (
                            <button
                                type="button"
                                onClick={handleShowPrescriptionForm}
                                className="add-prescription-btn"
                            >
                                + Add Prescription
                            </button>
                        )}
                    </div>
                </div>

                {/* Notes and Files Section */}
                <div className="notes-files-container">
                    <div className="notes-section">
                        <h4>Patient Notes</h4>
                        <textarea
                            value={patientNotes}
                            onChange={(e) => setPatientNotes(e.target.value)}
                            placeholder="Add any additional notes for the patient..."
                            className="notes-textarea"
                        />
                    </div>

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
                        disabled={isSubmitting || !treatmentForm.appointmentId}
                        className="submit-btn"
                    >
                        {isSubmitting ? 'Adding Treatments...' : 'Add Treatments'}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddTreatmentForm;