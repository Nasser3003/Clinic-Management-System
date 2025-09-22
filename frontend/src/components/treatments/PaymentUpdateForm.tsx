import React, { useState } from 'react';

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

        // Validation
        if (newAmount < 0) {
            alert('Payment amount cannot be negative');
            return;
        }

        if (newAmount > totalCost) {
            alert('Payment amount cannot exceed total cost');
            return;
        }

        onUpdate(treatmentId, newAmount);
        setShowForm(false);
    };

    const handleCancel = () => {
        setNewAmount(currentAmount); // Reset to original value
        setShowForm(false);
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === '') {
            setNewAmount(0);
            return;
        }

        const numValue = parseFloat(value);
        if (!isNaN(numValue))
            setNewAmount(numValue);
    };

    if (!showForm)
        return (
            <button
                onClick={() => setShowForm(true)}
                className="update-payment-btn"
            >
                Update Payment
            </button>
        );

    return (
        <form onSubmit={handleSubmit} className="payment-update-form">
            <div className="form-group">
                <label htmlFor={`payment-${treatmentId}`}>
                    New Amount Paid (${currentAmount.toFixed(2)} → ${newAmount.toFixed(2)})
                </label>
                <input
                    id={`payment-${treatmentId}`}
                    type="number"
                    min="0"
                    step="0.01"
                    max={totalCost}
                    value={newAmount}
                    onChange={handleAmountChange}
                    required
                    className="form-input"
                    autoFocus
                />
                <small className="payment-hint">
                    Remaining: ${(totalCost - newAmount).toFixed(2)} of ${totalCost.toFixed(2)}
                </small>
            </div>
            <div className="form-actions">
                <button type="submit" className="confirm-btn">
                    Update
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default PaymentUpdateForm;