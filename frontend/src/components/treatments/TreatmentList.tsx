import React, { useState } from 'react';
import PaymentUpdateForm from './PaymentUpdateForm';
import TreatmentPrescriptionManager from './TreatmentPrescriptionManager';
import { Treatment } from '../../types/treatments';

interface TreatmentListProps {
    treatments: Treatment[];
    loading: boolean;
    isDoctor: boolean;
    isAdmin: boolean;
    isEmployee: boolean;
    filters: {
        prescriptionKeyword: string;
        visitNotesKeyword: string;
    };
    onUpdatePayment: (treatmentId: string, newAmount: number) => void;
    onPrescriptionUpdate: (treatmentId: string, prescriptions: any[]) => void;
}

function TreatmentList({
                           treatments,
                           loading,
                           isDoctor,
                           isAdmin,
                           isEmployee,
                           filters,
                           onUpdatePayment,
                           onPrescriptionUpdate
                       }: TreatmentListProps) {
    const [expandedPrescriptions, setExpandedPrescriptions] = useState<Record<string, Set<number>>>({});

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

    const togglePrescriptionExpansion = (treatmentId: string, prescriptionIndex: number) => {
        setExpandedPrescriptions(prev => {
            const treatmentExpanded = prev[treatmentId] || new Set();
            const newSet = new Set(treatmentExpanded);

            if (newSet.has(prescriptionIndex)) {
                newSet.delete(prescriptionIndex);
            } else {
                newSet.add(prescriptionIndex);
            }

            return {
                ...prev,
                [treatmentId]: newSet
            };
        });
    };

    const isPrescriptionExpanded = (treatmentId: string, prescriptionIndex: number) => {
        return expandedPrescriptions[treatmentId]?.has(prescriptionIndex) || false;
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>Loading treatments...</p>
            </div>
        );
    }

    if (treatments.length === 0) {
        return (
            <div className="empty-state">
                <p>No treatments found with the current filters</p>
                <small>Try adjusting your search criteria or clearing filters</small>
            </div>
        );
    }

    return (
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
                        {/* Header with main info, cost grid, and primary action */}
                        <div className="treatment-header">
                            <div className="treatment-info">
                                <h4
                                    dangerouslySetInnerHTML={{
                                        __html: highlightText(treatment.treatmentDescription, searchKeywords)
                                    }}
                                />
                                <div className="treatment-meta">
                                    <span>👤 {treatment.patientName}</span>
                                    <span>👨‍⚕️ {treatment.doctorName}</span>
                                    <span>📅 {formatDate(treatment.createdAt)}</span>
                                    <span className={`payment-status ${getPaymentStatusColor(paymentStatus)}`}>
                                        {paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Compact Cost Grid */}
                            <div className="compact-cost-grid">
                                <div className="compact-cost-item">
                                    <div className="compact-cost-label">Total</div>
                                    <div className="compact-cost-value">
                                        {formatCurrency(treatment.cost).replace('$', '$').replace('.00', '')}
                                    </div>
                                </div>
                                <div className="compact-cost-item">
                                    <div className="compact-cost-label">Paid</div>
                                    <div className="compact-cost-value positive">
                                        {formatCurrency(treatment.amountPaid).replace('$', '$').replace('.00', '')}
                                    </div>
                                </div>
                                <div className="compact-cost-item">
                                    <div className="compact-cost-label">Balance</div>
                                    <div className={`compact-cost-value ${treatment.remainingBalance > 0 ? 'outstanding' : 'positive'}`}>
                                        {formatCurrency(treatment.remainingBalance).replace('$', '$').replace('.00', '')}
                                    </div>
                                </div>
                                <div className="compact-cost-item">
                                    <div className="compact-cost-label">Terms</div>
                                    <div className="compact-cost-value">
                                        {treatment.installmentPeriodInMonths > 0 ? `${treatment.installmentPeriodInMonths}mo` : 'N/A'}
                                    </div>
                                </div>
                            </div>

                            {/* Primary Action */}
                            {treatment.remainingBalance > 0 && (isDoctor || isAdmin || isEmployee) && (
                                <div className="treatment-header-actions">
                                    <PaymentUpdateForm
                                        treatmentId={treatment.id}
                                        currentAmount={treatment.amountPaid}
                                        totalCost={treatment.cost}
                                        onUpdate={onUpdatePayment}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Details section: Notes + Secondary Actions */}
                        <div className="treatment-details">
                            {treatment.visitNotes && (
                                <div className="visit-notes-section">
                                    <div className="visit-notes-label">📝 Visit Notes</div>
                                    <div
                                        className="visit-notes-content"
                                        dangerouslySetInnerHTML={{
                                            __html: highlightText(
                                                treatment.visitNotes.length > 200
                                                    ? `${treatment.visitNotes.substring(0, 200)}...`
                                                    : treatment.visitNotes,
                                                searchKeywords
                                            )
                                        }}
                                    />
                                </div>
                            )}

                            <div className="treatment-actions">
                                <TreatmentPrescriptionManager
                                    treatment={treatment}
                                    isDoctor={isDoctor}
                                    isAdmin={isAdmin}
                                    isEmployee={isEmployee}
                                    onPrescriptionUpdate={onPrescriptionUpdate}
                                />
                            </div>
                        </div>

                        {/* Compact Prescriptions */}
                        {treatment.prescriptions && treatment.prescriptions.length > 0 && (
                            <div className="prescriptions-compact">
                                <div className="prescriptions-header">
                                    <div className="prescriptions-title">💊 Prescriptions</div>
                                    <div className="prescriptions-count">
                                        {treatment.prescriptions.length} medication{treatment.prescriptions.length !== 1 ? 's' : ''}
                                    </div>
                                </div>

                                <div className="prescriptions-list">
                                    {treatment.prescriptions.map((prescription, index) => (
                                        <div key={index}>
                                            <div
                                                className={`prescription-pill ${isPrescriptionExpanded(treatment.id, index) ? 'expanded' : ''}`}
                                                onClick={() => togglePrescriptionExpansion(treatment.id, index)}
                                            >
                                                {prescription.medicationName} {prescription.dosage}
                                            </div>

                                            {isPrescriptionExpanded(treatment.id, index) && (
                                                <div className="prescription-details expanded">
                                                    <div className="prescription-detail-grid">
                                                        <div className="prescription-detail-item">
                                                            <div className="prescription-detail-label">Frequency</div>
                                                            <div className="prescription-detail-value">{prescription.frequency}</div>
                                                        </div>
                                                        <div className="prescription-detail-item">
                                                            <div className="prescription-detail-label">Duration</div>
                                                            <div className="prescription-detail-value">{prescription.duration}</div>
                                                        </div>
                                                    </div>

                                                    {prescription.instructions && (
                                                        <div className="prescription-instructions">
                                                            <div className="prescription-instructions-label">Instructions</div>
                                                            <div className="prescription-instructions-value">
                                                                {prescription.instructions}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default TreatmentList;