import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/TreatmentManagement.css';

interface TreatmentDetails {
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
}

interface TreatmentFormData {
    appointmentId: string;
    treatments: TreatmentDetails[];
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
        endDate: ''
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

    const handleTreatmentChange = (index: number, field: keyof TreatmentDetails, value: string | number) => {
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

    return (
        <Layout>

            <div className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">Treatment Management</h1>
                    <p className="hero-subtitle">Track treatments, costs, and payment status</p>
                </div>

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
                                <p>View and manage treatment records and payments</p>
                            </div>

                            {/* Filters */}
                            <div className="filters-section">
                                <div className="filters-grid">
                                    {(isAdmin || isEmployee) && (
                                        <>
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
                                        </>
                                    )}

                                    <div className="filter-group">
                                        <label>Payment Status</label>
                                        <select
                                            value={filters.paid}
                                            onChange={(e) => setFilters(prev => ({ ...prev, paid: e.target.value }))}
                                            className="filter-select"
                                        >
                                            <option value="">All Payments</option>
                                            <option value="true">Paid</option>
                                            <option value="false">Outstanding</option>
                                        </select>
                                    </div>

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
                                            patientEmail: '',
                                            doctorEmail: '',
                                            paid: '',
                                            startDate: '',
                                            endDate: ''
                                        })}
                                        className="clear-filters-btn"
                                    >
                                        Clear Filters
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
                                </div>
                            ) : (
                                <div className="treatments-list">
                                    {treatments.map((treatment) => {
                                        const paymentStatus = getPaymentStatus(treatment);
                                        return (
                                            <div key={treatment.id} className="treatment-card">
                                                <div className="treatment-header">
                                                    <div className="treatment-info">
                                                        <h4>{treatment.treatmentDescription}</h4>
                                                        <div className="treatment-meta">
                                                            <span>Patient: {treatment.patientName}</span>
                                                            <span>Doctor: {treatment.doctorName}</span>
                                                            <span>Date: {formatDate(treatment.createdAt)}</span>
                                                        </div>
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