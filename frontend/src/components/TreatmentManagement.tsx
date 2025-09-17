import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/TreatmentManagement.css';
import HeroHeader from "./common/HeroHeader";

interface TreatmentManagement {
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    installmentPeriodInMonths: number;
}

interface Treatment {
    id: string;
    doctorName: string;
    patientName: string;
    appointmentId: string;
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    remainingBalance: number;
    installmentPeriodInMonths: number;
    createdAt: string;
    updatedAt: string;
    // New fields for enhanced search
    prescriptions?: string[];
    visitNotes?: string;
}

interface TreatmentFormData {
    appointmentId: string;
    treatments: TreatmentManagement[];
}

function TreatmentManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'view-treatments' | 'add-treatment'>('view-treatments');
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [appointments, setAppointments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [filters, setFilters] = useState({
        patientEmail: '',
        doctorEmail: '',
        paid: '', // 'true', 'false', or ''
        startDate: '',
        endDate: '',
        // New search filters
        prescriptionKeyword: '',
        visitNotesKeyword: ''
    });

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

    const isDoctor = user?.role === 'DOCTOR';
    const isAdmin = user?.role === 'ADMIN';
    const isEmployee = ['NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user?.role || '');

    useEffect(() => {
        if (activeTab === 'view-treatments') {
            loadTreatments();
        } else if (activeTab === 'add-treatment') {
            loadCompletedAppointments();
        }
    }, [activeTab, filters]);

    const loadTreatments = async () => {
        setLoading(true);
        setError('');

        try {
            const params = new URLSearchParams();
            if (filters.patientEmail) params.append('patientEmail', filters.patientEmail);
            if (filters.doctorEmail) params.append('doctorEmail', filters.doctorEmail);
            if (filters.paid) params.append('paid', filters.paid);
            if (filters.startDate) params.append('startDate', filters.startDate);
            if (filters.endDate) params.append('endDate', filters.endDate);

            // New search parameters
            if (filters.prescriptionKeyword) params.append('prescriptionKeyword', filters.prescriptionKeyword);
            if (filters.visitNotesKeyword) params.append('visitNotesKeyword', filters.visitNotesKeyword);

            const queryString = params.toString();
            const url = `/api/treatments${queryString ? `?${queryString}` : ''}`;

            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                setTreatments(data);
            } else {
                throw new Error('Failed to load treatments');
            }
        } catch (err: any) {
            console.error('Error loading treatments:', err);
            setError('Failed to load treatments');
        } finally {
            setLoading(false);
        }
    };

    const loadCompletedAppointments = async () => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/appointments?status=COMPLETED', {
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

    const handleSubmitTreatments = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        // Validation
        if (!treatmentForm.appointmentId) {
            setError('Please select an appointment');
            setSubmitting(false);
            return;
        }

        if (treatmentForm.treatments.some(t => !t.treatmentDescription.trim())) {
            setError('Please provide description for all treatments');
            setSubmitting(false);
            return;
        }

        if (treatmentForm.treatments.some(t => t.cost <= 0)) {
            setError('Treatment cost must be greater than 0');
            setSubmitting(false);
            return;
        }

        if (treatmentForm.treatments.some(t => t.amountPaid < 0)) {
            setError('Amount paid cannot be negative');
            setSubmitting(false);
            return;
        }

        if (treatmentForm.treatments.some(t => t.amountPaid > t.cost)) {
            setError('Amount paid cannot exceed treatment cost');
            setSubmitting(false);
            return;
        }

        try {
            const response = await fetch(`/api/treatments/appointment/${treatmentForm.appointmentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(treatmentForm.treatments)
            });

            if (response.ok) {
                setSuccess('Treatments added successfully!');
                setTreatmentForm({
                    appointmentId: '',
                    treatments: [{
                        treatmentDescription: '',
                        cost: 0,
                        amountPaid: 0,
                        installmentPeriodInMonths: 0
                    }]
                });
                setActiveTab('view-treatments');
            } else {
                const errorData = await response.text();
                throw new Error(errorData || 'Failed to add treatments');
            }
        } catch (err: any) {
            console.error('Error adding treatments:', err);
            setError(err.message || 'Failed to add treatments');
        } finally {
            setSubmitting(false);
        }
    };

    const handleUpdatePayment = async (treatmentId: string, newAmountPaid: number) => {
        try {
            const response = await fetch(`/api/treatments/${treatmentId}/payment`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amountPaid: newAmountPaid })
            });

            if (response.ok) {
                setSuccess('Payment updated successfully!');
                loadTreatments();
            } else {
                throw new Error('Failed to update payment');
            }
        } catch (err: any) {
            console.error('Error updating payment:', err);
            setError('Failed to update payment');
        }
    };

    const handleClearFilters = () => {
        setFilters({
            patientEmail: '',
            doctorEmail: '',
            paid: '',
            startDate: '',
            endDate: '',
            prescriptionKeyword: '',
            visitNotesKeyword: ''
        });
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    const getPaymentStatus = (treatment: Treatment) => {
        if (treatment.remainingBalance === 0) return 'Paid';
        if (treatment.amountPaid === 0) return 'Unpaid';
        return 'Partial';
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status) {
            case 'Paid': return 'paid';
            case 'Unpaid': return 'unpaid';
            case 'Partial': return 'partial';
            default: return '';
        }
    };

    const highlightText = (text: string, keywords: string[]) => {
        if (!keywords.length || !text) return text;

        let highlightedText = text;
        keywords.forEach(keyword => {
            if (keyword.trim()) {
                const regex = new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
            }
        });

        return highlightedText;
    };

    const getSearchKeywords = () => {
        const keywords = [];
        if (filters.prescriptionKeyword) keywords.push(filters.prescriptionKeyword);
        if (filters.visitNotesKeyword) keywords.push(filters.visitNotesKeyword);
        return keywords;
    };

    return (
        <Layout>
            <HeroHeader
                title="Treatment Management"
                subtitle="Track treatments, costs, and payment status with advanced search capabilities"
            />

            <div>
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
                        <button
                            className={`tab-button ${activeTab === 'view-treatments' ? 'active' : ''}`}
                            onClick={() => setActiveTab('view-treatments')}
                        >
                            View Treatments
                        </button>
                        {(isDoctor || isAdmin) && (
                            <button
                                className={`tab-button ${activeTab === 'add-treatment' ? 'active' : ''}`}
                                onClick={() => setActiveTab('add-treatment')}
                            >
                                Add Treatment
                            </button>
                        )}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {activeTab === 'view-treatments' && (
                        <div className="view-treatments-section">
                            <div className="section-header">
                                <h3>Treatment Records</h3>
                                <p>View and manage treatment records and payments with comprehensive search</p>
                            </div>

                            {/* Compact Filters */}
                            <div className="filters-section">
                                <div className="filters-grid compact">
                                    {(isAdmin || isEmployee) && (
                                        <>
                                            <div className="filter-group">
                                                <label>
                                                    <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                                    </svg>
                                                    Doctor
                                                </label>
                                                <input
                                                    type="email"
                                                    value={filters.doctorEmail}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, doctorEmail: e.target.value }))}
                                                    placeholder="Doctor"
                                                    className="filter-input compact"
                                                />
                                            </div>

                                            <div className="filter-group">
                                                <label>
                                                    <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                    </svg>
                                                    Patient
                                                </label>
                                                <input
                                                    type="email"
                                                    value={filters.patientEmail}
                                                    onChange={(e) => setFilters(prev => ({ ...prev, patientEmail: e.target.value }))}
                                                    placeholder="Patient"
                                                    className="filter-input compact"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div className="filter-group">
                                        <label>
                                            <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                            </svg>
                                            Status
                                        </label>
                                        <select
                                            value={filters.paid}
                                            onChange={(e) => setFilters(prev => ({ ...prev, paid: e.target.value }))}
                                            className="filter-select compact"
                                        >
                                            <option value="">All</option>
                                            <option value="true">Paid</option>
                                            <option value="false">Outstanding</option>
                                        </select>
                                    </div>

                                    <div className="filter-group">
                                        <label>
                                            <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            From
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.startDate}
                                            onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                                            className="filter-input compact"
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label>
                                            <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                            </svg>
                                            To
                                        </label>
                                        <input
                                            type="date"
                                            value={filters.endDate}
                                            onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                                            className="filter-input compact"
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label>
                                            <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                                            </svg>
                                            Prescriptions
                                        </label>
                                        <input
                                            type="text"
                                            value={filters.prescriptionKeyword}
                                            onChange={(e) => setFilters(prev => ({ ...prev, prescriptionKeyword: e.target.value }))}
                                            placeholder="Search meds"
                                            className="filter-input search-input compact"
                                        />
                                    </div>

                                    <div className="filter-group">
                                        <label>
                                            <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                                            </svg>
                                            Notes
                                        </label>
                                        <input
                                            type="text"
                                            value={filters.visitNotesKeyword}
                                            onChange={(e) => setFilters(prev => ({ ...prev, visitNotesKeyword: e.target.value }))}
                                            placeholder="Search notes"
                                            className="filter-input search-input compact"
                                        />
                                    </div>
                                </div>

                                <div className="filter-actions compact">
                                    <button
                                        onClick={handleClearFilters}
                                        className="clear-filters-btn"
                                    >
                                        Clear All
                                    </button>
                                </div>
                            </div>

                            {/* Treatments List */}
                            {loading ? (
                                <div className="loading-state">
                                    <div className="loading-spinner"></div>
                                    <p>Loading treatments...</p>
                                </div>
                            ) : treatments.length === 0 ? (
                                <div className="empty-state">
                                    <p>No treatments found with the current filters</p>
                                    <small>Try adjusting your search criteria or clearing filters</small>
                                </div>
                            ) : (
                                <div className="treatments-list">
                                    <div className="results-summary">
                                        <span className="results-count">
                                            {treatments.length} treatment{treatments.length !== 1 ? 's' : ''} found
                                        </span>
                                        {(filters.prescriptionKeyword || filters.visitNotesKeyword) && (
                                            <span className="search-indicator">
                                                <svg className="search-icon-small" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                                Search results
                                            </span>
                                        )}
                                    </div>

                                    {treatments.map((treatment) => {
                                        const paymentStatus = getPaymentStatus(treatment);
                                        const searchKeywords = getSearchKeywords();

                                        return (
                                            <div key={treatment.id} className="treatment-card">
                                                <div className="treatment-header">
                                                    <div className="treatment-info">
                                                        <h4
                                                            dangerouslySetInnerHTML={{
                                                                __html: highlightText(treatment.treatmentDescription, searchKeywords)
                                                            }}
                                                        />
                                                        <div className="treatment-meta">
                                                            <span>Patient: {treatment.patientName}</span>
                                                            <span>Doctor: {treatment.doctorName}</span>
                                                            <span>Date: {formatDate(treatment.createdAt)}</span>
                                                        </div>

                                                        {/* Display related prescriptions if available */}
                                                        {treatment.prescriptions && treatment.prescriptions.length > 0 && (
                                                            <div className="prescriptions-info">
                                                                <span className="prescriptions-label">Prescriptions:</span>
                                                                <div className="prescriptions-list">
                                                                    {treatment.prescriptions.map((prescription, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="prescription-item"
                                                                            dangerouslySetInnerHTML={{
                                                                                __html: highlightText(prescription, searchKeywords)
                                                                            }}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Display visit notes excerpt if available */}
                                                        {treatment.visitNotes && (
                                                            <div className="visit-notes-info">
                                                                <span className="visit-notes-label">Visit Notes:</span>
                                                                <p
                                                                    className="visit-notes-excerpt"
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: highlightText(
                                                                            treatment.visitNotes.length > 150
                                                                                ? `${treatment.visitNotes.substring(0, 150)}...`
                                                                                : treatment.visitNotes,
                                                                            searchKeywords
                                                                        )
                                                                    }}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <span className={`payment-status ${getPaymentStatusColor(paymentStatus)}`}>
                                                        {paymentStatus}
                                                    </span>
                                                </div>

                                                <div className="treatment-details">
                                                    <div className="cost-breakdown">
                                                        <div className="cost-item">
                                                            <span className="cost-label">Total Cost:</span>
                                                            <span className="cost-value">{formatCurrency(treatment.cost)}</span>
                                                        </div>
                                                        <div className="cost-item">
                                                            <span className="cost-label">Amount Paid:</span>
                                                            <span className="cost-value">{formatCurrency(treatment.amountPaid)}</span>
                                                        </div>
                                                        <div className="cost-item">
                                                            <span className="cost-label">Remaining:</span>
                                                            <span className="cost-value outstanding">{formatCurrency(treatment.remainingBalance)}</span>
                                                        </div>
                                                        {treatment.installmentPeriodInMonths > 0 && (
                                                            <div className="cost-item">
                                                                <span className="cost-label">Installment Period:</span>
                                                                <span className="cost-value">{treatment.installmentPeriodInMonths} months</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {treatment.remainingBalance > 0 && (isDoctor || isAdmin || isEmployee) && (
                                                        <div className="payment-actions">
                                                            <PaymentUpdateForm
                                                                treatmentId={treatment.id}
                                                                currentAmount={treatment.amountPaid}
                                                                totalCost={treatment.cost}
                                                                onUpdate={handleUpdatePayment}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'add-treatment' && (isDoctor || isAdmin) && (
                        <div className="add-treatment-section">
                            <div className="section-header">
                                <h3>Add Treatment Record</h3>
                                <p>Add treatment details for a completed appointment</p>
                            </div>

                            <form onSubmit={handleSubmitTreatments} className="treatment-form">
                                <div className="form-group">
                                    <label htmlFor="appointmentId">Select Appointment</label>
                                    <select
                                        id="appointmentId"
                                        value={treatmentForm.appointmentId}
                                        onChange={(e) => setTreatmentForm(prev => ({ ...prev, appointmentId: e.target.value }))}
                                        required
                                        className="form-select"
                                    >
                                        <option value="">Choose an appointment</option>
                                        {appointments.map((appointment) => (
                                            <option key={appointment.id} value={appointment.id}>
                                                {appointment.patientName} - {appointment.doctorName} - {formatDate(appointment.startDateTime)}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="treatments-section">
                                    <div className="treatments-header">
                                        <h4>Treatment Details</h4>
                                        <button
                                            type="button"
                                            onClick={handleAddTreatment}
                                            className="add-treatment-btn"
                                        >
                                            Add Another Treatment
                                        </button>
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
                                                        className="form-textarea"
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
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="submit-btn"
                                    >
                                        {submitting ? 'Adding Treatments...' : 'Add Treatments'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}

// Payment Update Form Component
interface PaymentUpdateFormProps {
    treatmentId: string;
    currentAmount: number;
    totalCost: number;
    onUpdate: (treatmentId: string, newAmount: number) => void;
}

function PaymentUpdateForm({ treatmentId, currentAmount, totalCost, onUpdate }: PaymentUpdateFormProps) {
    const [newAmount, setNewAmount] = useState(currentAmount);
    const [showForm, setShowForm] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onUpdate(treatmentId, newAmount);
        setShowForm(false);
    };

    if (!showForm) {
        return (
            <button
                onClick={() => setShowForm(true)}
                className="update-payment-btn"
            >
                Update Payment
            </button>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="payment-update-form">
            <div className="form-group">
                <label>New Amount Paid ($)</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    max={totalCost}
                    value={newAmount}
                    onChange={(e) => setNewAmount(parseFloat(e.target.value) || 0)}
                    required
                    className="form-input"
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="confirm-btn">
                    Update
                </button>
                <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="cancel-btn"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default TreatmentManagement;