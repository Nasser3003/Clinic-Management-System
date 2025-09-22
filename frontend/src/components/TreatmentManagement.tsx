import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import HeroHeader from './common/HeroHeader';
import TreatmentFilters from './treatments/TreatmentFilter';
import TreatmentList from './treatments/TreatmentList';
import AddTreatmentForm from './treatments/AddTreatmentForm';
import './css/TreatmentManagement.css';

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
    prescriptions?: string[];
    visitNotes?: string;
}

interface TreatmentFilters {
    patientEmail: string;
    doctorEmail: string;
    paid: string;
    startDate: string;
    endDate: string;
    prescriptionKeyword: string;
    visitNotesKeyword: string;
}

interface SubmitData {
    appointmentId: string;
    formData: FormData;
    resetForm: () => void;
}

function TreatmentManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'view-treatments' | 'add-treatment'>('view-treatments');
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [filters, setFilters] = useState<TreatmentFilters>({
        patientEmail: '',
        doctorEmail: '',
        paid: '',
        startDate: '',
        endDate: '',
        prescriptionKeyword: '',
        visitNotesKeyword: ''
    });

    const isDoctor = user?.userType === 'DOCTOR';
    const isAdmin = user?.userType === 'ADMIN';
    const isEmployee = ['NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user?.userType || '');

    useEffect(() => {
        if (activeTab === 'view-treatments') {
            loadTreatments();
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

    const handleSubmitTreatments = async (data: SubmitData) => {
        const { appointmentId, formData, resetForm } = data;
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const response = await fetch(`/api/treatments/appointment/${appointmentId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (response.ok) {
                setSuccess('Treatments, notes, and files added successfully!');
                resetForm();
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

    // Clear messages after 5 seconds
    useEffect(() => {
        if (error || success) {
            const timeout = setTimeout(() => {
                setError('');
                setSuccess('');
            }, 5000);
            return () => clearTimeout(timeout);
        }
    }, [error, success]);

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

                            <TreatmentFilters
                                filters={filters}
                                setFilters={setFilters}
                                isAdmin={isAdmin}
                                isEmployee={isEmployee}
                                onClearFilters={handleClearFilters}
                            />

                            <TreatmentList
                                treatments={treatments}
                                loading={loading}
                                isDoctor={isDoctor}
                                isAdmin={isAdmin}
                                isEmployee={isEmployee}
                                filters={{
                                    prescriptionKeyword: filters.prescriptionKeyword,
                                    visitNotesKeyword: filters.visitNotesKeyword
                                }}
                                onUpdatePayment={handleUpdatePayment}
                            />
                        </div>
                    )}

                    {activeTab === 'add-treatment' && (isDoctor || isAdmin) && (
                        <AddTreatmentForm
                            isAdmin={isAdmin}
                            isDoctor={isDoctor}
                            isEmployee={isEmployee}
                            currentUser={user}
                            onSubmit={handleSubmitTreatments}
                            submitting={submitting}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default TreatmentManagement;