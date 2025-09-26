import React from 'react';
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
                                        onUpdate={onUpdatePayment}
                                    />
                                </div>
                            )}
                        </div>

                        {/* Prescription Management Section */}
                        <TreatmentPrescriptionManager
                            treatment={treatment}
                            isDoctor={isDoctor}
                            isAdmin={isAdmin}
                            isEmployee={isEmployee}
                            onPrescriptionUpdate={onPrescriptionUpdate}
                        />
                    </div>
                );
            })}
        </div>
    );
}

export default TreatmentList;