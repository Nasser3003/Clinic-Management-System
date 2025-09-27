import React, { useState, useEffect } from 'react';
import PrescriptionList from './PrescriptionList';
import { Prescription, Treatment } from '../../types/treatments';  // Import from types file

interface TreatmentPrescriptionManagerProps {
    treatment: Treatment;
    isDoctor: boolean;
    isAdmin: boolean;
    isEmployee: boolean;
    onPrescriptionUpdate: (treatmentId: string, prescriptions: Prescription[]) => void;
    onEditStart?: () => void;
    onEditEnd?: () => void;
}

function TreatmentPrescriptionManager({
                                          treatment,
                                          isDoctor,
                                          isAdmin,
                                          isEmployee,
                                          onPrescriptionUpdate,
                                          onEditStart,
                                          onEditEnd
                                      }: TreatmentPrescriptionManagerProps) {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>(
        treatment.prescriptions || []
    );
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
                name: '',  // Using 'name' to match backend
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
            p.name.trim() || p.dosage.trim() || p.frequency.trim() || p.duration.trim()
        );

        if (filledPrescriptions.some(p => !p.name.trim()))
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
                onPrescriptionUpdate(treatment.id, updatedPrescriptions);
                onEditEnd?.();
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
        setError(null);
        onEditEnd?.();
    };

    if (!canEdit) {
        return null;
    }

    return (
        <div className="treatment-prescription-manager">
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

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
                        className="save-prescriptions-btn btn btn-primary"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Prescriptions'}
                    </button>
                    <button
                        onClick={handleCancel}
                        disabled={isSubmitting}
                        className="cancel-prescriptions-btn btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TreatmentPrescriptionManager;