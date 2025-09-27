import React from 'react';
import PrescriptionForm from './PrescriptionForm';
import { Prescription } from '../../types/treatments';  // Import from types file


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
    const medicationCount = prescriptions.length;
    const medicationText = `${medicationCount} medication${medicationCount !== 1 ? 's' : ''}`;

    return (
        <div className="prescriptions-section">
            {/* Single header above all prescription cards */}
            <div className="prescriptions-main-header">
                <h4>
                    {title}
                    <span className="prescription-count">{medicationText}</span>
                </h4>
            </div>

            {/* Flex container for prescription items */}
            <div className="prescriptions-flex-container">
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
            </div>

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