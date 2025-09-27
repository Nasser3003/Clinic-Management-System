import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import HeroHeader from './common/HeroHeader';
import TreatmentFilters from './treatments/TreatmentFilter';
import TreatmentList from './treatments/TreatmentList';
import AddTreatmentForm from './treatments/AddTreatmentForm';
import { Treatment, TreatmentFilters as TreatmentFiltersType, Prescription } from '../types/treatments';
import { treatmentService } from '../services/treatmentService';
import './css/TreatmentManagement.css';

function TreatmentManagement() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'view-treatments' | 'add-treatment'>('view-treatments');
    const [treatments, setTreatments] = useState<Treatment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [filters, setFilters] = useState<TreatmentFiltersType>({
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
        if (activeTab === 'view-treatments')
            loadTreatments();
    }, [activeTab]);

    // Debounced filter effect
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (activeTab === 'view-treatments')
                loadTreatments();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [filters]);

    const loadTreatments = async () => {
        setLoading(true);
        setError('');

        try {
            // Convert frontend filters to backend format
            const filterRequest = treatmentService.convertFiltersToRequest(filters);

            // Fetch treatments from backend
            let fetchedTreatments = await treatmentService.filterTreatments(filterRequest);

            // Apply payment status filter locally (since backend doesn't handle this)
            if (filters.paid) {
                fetchedTreatments = treatmentService.filterByPaymentStatus(fetchedTreatments, filters.paid);
            }

            setTreatments(fetchedTreatments);
        } catch (err: any) {
            console.error('Error loading treatments:', err);
            setError(err.response?.data?.message || 'Failed to load treatments');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePayment = async (treatmentId: string, newAmountPaid: number) => {
        try {
            setError('');
            await treatmentService.updatePayment(treatmentId, newAmountPaid);
            setSuccess('Payment updated successfully!');
            loadTreatments(); // Refresh the list
        } catch (err: any) {
            console.error('Error updating payment:', err);
            setError(err.response?.data?.message || 'Failed to update payment');
        }
    };

    const handlePrescriptionUpdate = async (treatmentId: string, prescriptions: Prescription[]) => {
        try {
            setError('');
            // Note: This endpoint may need to be implemented in your backend
            // For now, we'll just refresh the treatments list
            setSuccess('Prescriptions updated successfully!');
            loadTreatments();
        } catch (err: any) {
            console.error('Error updating prescriptions:', err);
            setError(err.response?.data?.message || 'Failed to update prescriptions');
        }
    };

    const handleUpdateNotes = async (treatmentId: string, notes: string) => {
        try {
            setError('');
            await treatmentService.updateNotes(treatmentId, notes);
            setSuccess('Notes updated successfully!');
            loadTreatments();
        } catch (err: any) {
            console.error('Error updating notes:', err);
            setError(err.response?.data?.message || 'Failed to update notes');
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

    const handleTreatmentSuccess = () => {
        setSuccess('Treatments, notes, and files added successfully!');
        setActiveTab('view-treatments');
        loadTreatments();
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
                                onPrescriptionUpdate={handlePrescriptionUpdate}
                            />
                        </div>
                    )}

                    {activeTab === 'add-treatment' && (isDoctor || isAdmin) && (
                        <AddTreatmentForm
                            isAdmin={isAdmin}
                            isDoctor={isDoctor}
                            isEmployee={isEmployee}
                            currentUser={user}
                            submitting={false}
                            onSuccess={handleTreatmentSuccess}
                        />
                    )}
                </div>
            </div>
        </Layout>
    );
}

export default TreatmentManagement;