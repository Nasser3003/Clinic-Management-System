import React, { useState, useEffect } from 'react';
import PrescriptionList from './PrescriptionList';

interface Prescription {
    id?: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    treatmentId?: string;
}

interface Treatment {
    id: string;
    treatmentDescription: string;
    cost: number;
    amountPaid: number;
    remainingBalance: number;
    installmentPeriodInMonths: number;
    prescriptions?: Prescription[];
    patientName: string;
    doctorName: string;
    createdAt: string;
}

interface TreatmentPrescriptionManagerProps {
    treatment: Treatment;
    isDoctor: boolean;
    isAdmin: boolean;
    isEmployee: boolean;
    onPrescriptionUpdate: (treatmentId: string, prescriptions: Prescription[]) => void;
}

function TreatmentPrescriptionManager({
                                          treatment,
                                          isDoctor,
                                          isAdmin,
                                          isEmployee,
                                          onPrescriptionUpdate
                                      }: TreatmentPrescriptionManagerProps) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(
        treatment.prescriptions || []
    );
    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setPrescriptions(treatment.prescriptions || []);
    }, [treatment.prescriptions]);

    const canEdit = isDoctor || isAdmin || isEmployee;

    const handlePrescriptionUpdate = (index: number, field: keyof Prescription, value: string) => {
        setPrescriptions(prev =>
            prev.map((prescription, i) =>
                i === index ? { ...prescription, [field]: value } : prescription
            )
        );
    };

    const handleAddPrescription = () => {
        setPrescriptions(prev => [
            ...prev,
            {
                medicationName: '',
                dosage: '',
                frequency: '',
                duration: '',
                instructions: '',
                treatmentId: treatment.id
            }
        ]);
    };

    const handleRemovePrescription = (index: number) => {
        if (prescriptions.length > 1)
            setPrescriptions(prev => prev.filter((_, i) => i !== index));
    };

    const validatePrescriptions = () => {
        const filledPrescriptions = prescriptions.filter(p =>
            p.medicationName.trim() || p.dosage.trim() || p.frequency.trim() || p.duration.trim()
        );

        if (filledPrescriptions.some(p => !p.medicationName.trim()))
            throw new Error('Please provide medication name for all prescriptions');

        if (filledPrescriptions.some(p => !p.dosage.trim()))
            throw new Error('Please provide dosage for all prescriptions');

        if (filledPrescriptions.some(p => !p.frequency.trim()))
            throw new Error('Please provide frequency for all prescriptions');

        if (filledPrescriptions.some(p => !p.duration.trim()))
            throw new Error('Please provide duration for all prescriptions');

        return filledPrescriptions;
    };

    const handleSave = async () => {
        setError(null);
        setIsSubmitting(true);

        try {
            const validPrescriptions = validatePrescriptions();

            const response = await fetch(`http://localhost:3001/treatments/${treatment.id}/prescriptions`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ prescriptions: validPrescriptions })
            });

            if (response.ok) {
                const updatedPrescriptions = await response.json();
                setPrescriptions(updatedPrescriptions);
                setIsEditing(false);
                onPrescriptionUpdate(treatment.id, updatedPrescriptions);
            } else {
                const errorText = await response.text();
                throw new Error(errorText || 'Failed to update prescriptions');
            }
        } catch (error) {
            console.error('Error updating prescriptions:', error);
            setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setPrescriptions(treatment.prescriptions || []);
        setIsEditing(false);
        setError(null);
    };

    if (!canEdit && (!prescriptions || prescriptions.length === 0)) {
        return null;
    }

    return (
        <div className="treatment-prescription-manager">
            <div className="prescription-header">
                <h4>Prescriptions for Treatment</h4>
                {canEdit && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="edit-prescriptions-btn"
                    >
                        {prescriptions.length > 0 ? 'Edit Prescriptions' : 'Add Prescriptions'}
                    </button>
                )}
            </div>

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {isEditing ? (
                <div className="prescription-editor">
                    <PrescriptionList
                        prescriptions={prescriptions}
                        onUpdate={handlePrescriptionUpdate}
                        onAdd={handleAddPrescription}
                        onRemove={handleRemovePrescription}
                        title="Edit Prescriptions"
                    />

                    <div className="prescription-actions">
                        <button
                            onClick={handleSave}
                            disabled={isSubmitting}
                            className="save-prescriptions-btn"
                        >
                            {isSubmitting ? 'Saving...' : 'Save Prescriptions'}
                        </button>
                        <button
                            onClick={handleCancel}
                            disabled={isSubmitting}
                            className="cancel-prescriptions-btn"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <div className="prescription-display">
                    {prescriptions.length > 0 ? (
                        <div className="prescriptions-list">
                            {prescriptions.map((prescription, index) => (
                                <div key={index} className="prescription-display-item">
                                    <div className="prescription-header">
                                        <h5>{prescription.medicationName}</h5>
                                        <span className="prescription-dosage">{prescription.dosage}</span>
                                    </div>
                                    <div className="prescription-details">
                                        <span><strong>Frequency:</strong> {prescription.frequency}</span>
                                        <span><strong>Duration:</strong> {prescription.duration}</span>
                                    </div>
                                    {prescription.instructions && (
                                        <div className="prescription-instructions">
                                            <strong>Instructions:</strong> {prescription.instructions}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-prescriptions">
                            <p>No prescriptions recorded for this treatment</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default TreatmentPrescriptionManager;