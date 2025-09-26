import React from 'react';
import PrescriptionForm from './PrescriptionForm';

interface Prescription {
    id?: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    treatmentId?: string;
}

interface PrescriptionListProps {
    prescriptions: Prescription[];
    onUpdate: (index: number, field: keyof Prescription, value: string) => void;
    onAdd: () => void;
    onRemove: (index: number) => void;
    title?: string;
    isReadOnly?: boolean;
}

function PrescriptionList({
                              prescriptions,
                              onUpdate,
                              onAdd,
                              onRemove,
                              title = "Prescriptions",
                              isReadOnly = false
                          }: PrescriptionListProps) {
    return (
        <div className="prescriptions-section">
            <div className="prescriptions-header">
                <h4>{title}</h4>
                <p>Medications prescribed for this treatment</p>
            </div>

            {prescriptions.map((prescription, index) => (
                <PrescriptionForm
                    key={index}
                    prescription={prescription}
                    index={index}
                    onUpdate={onUpdate}
                    onRemove={onRemove}
                    canRemove={prescriptions.length > 1}
                    isReadOnly={isReadOnly}
                />
            ))}

            {!isReadOnly && (
                <button
                    type="button"
                    onClick={onAdd}
                    className="add-prescription-btn"
                >
                    Add Another Prescription
                </button>
            )}
        </div>
    );
}

export default PrescriptionList;