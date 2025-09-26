interface Prescription {
    id?: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
    treatmentId?: string;
}

interface PrescriptionFormProps {
    prescription: Prescription;
    index: number;
    onUpdate: (index: number, field: keyof Prescription, value: string) => void;
    onRemove: (index: number) => void;
    canRemove: boolean;
    isReadOnly?: boolean;
}

function PrescriptionForm({
                              prescription,
                              index,
                              onUpdate,
                              onRemove,
                              canRemove,
                              isReadOnly = false
                          }: PrescriptionFormProps) {
    return (
        <div className="prescription-item">
            <div className="prescription-item-header">
                <h5>Prescription {index + 1}</h5>
                {canRemove && !isReadOnly && (
                    <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className="remove-prescription-btn"
                    >
                        Remove
                    </button>
                )}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Medication Name</label>
                    <input
                        type="text"
                        value={prescription.medicationName}
                        onChange={(e) => onUpdate(index, 'medicationName', e.target.value)}
                        placeholder="Enter medication name..."
                        className="form-input"
                        readOnly={isReadOnly}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Dosage</label>
                    <input
                        type="text"
                        value={prescription.dosage}
                        onChange={(e) => onUpdate(index, 'dosage', e.target.value)}
                        placeholder="e.g., 500mg"
                        className="form-input"
                        readOnly={isReadOnly}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Frequency</label>
                    <input
                        type="text"
                        value={prescription.frequency}
                        onChange={(e) => onUpdate(index, 'frequency', e.target.value)}
                        placeholder="e.g., Twice daily"
                        className="form-input"
                        readOnly={isReadOnly}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Duration</label>
                    <input
                        type="text"
                        value={prescription.duration}
                        onChange={(e) => onUpdate(index, 'duration', e.target.value)}
                        placeholder="e.g., 7 days"
                        className="form-input"
                        readOnly={isReadOnly}
                        required
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group full-width">
                    <label>Special Instructions</label>
                    <textarea
                        value={prescription.instructions || ''}
                        onChange={(e) => onUpdate(index, 'instructions', e.target.value)}
                        placeholder="Additional instructions for the patient..."
                        className="form-textarea compact"
                        rows={2}
                        readOnly={isReadOnly}
                    />
                </div>
            </div>
        </div>
    );
}

export default PrescriptionForm;
