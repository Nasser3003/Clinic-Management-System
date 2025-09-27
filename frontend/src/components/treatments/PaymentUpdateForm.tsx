import React, { useState } from 'react';
import { treatmentService } from '../../services/treatmentService';

interface PaymentUpdateFormProps {
    treatmentId: string;
    currentAmount: number;
    totalCost: number;
    onUpdate: (treatmentId: string, newAmount: number) => void;
}

function PaymentUpdateForm({ treatmentId, currentAmount, totalCost, onUpdate }: PaymentUpdateFormProps) {
    const [newAmount, setNewAmount] = useState(currentAmount);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (newAmount < 0) {
            setError('Payment amount cannot be negative');
            return;
        }

        if (newAmount > totalCost) {
            setError('Payment amount cannot exceed total cost');
            return;
        }

        if (newAmount === currentAmount) {
            setShowForm(false);
            return;
        }

        setIsSubmitting(true);

        try {
            await treatmentService.updatePayment(treatmentId, newAmount);
            onUpdate(treatmentId, newAmount);
            setShowForm(false);
        } catch (err: any) {
            console.error('Error updating payment:', err);
            setError(err.response?.data?.message || 'Failed to update payment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setNewAmount(currentAmount); // Reset to original value
        setShowForm(false);
        setError(null);
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
                disabled={isSubmitting}
            >
                Update Payment
            </button>
        );

    return (
        <form onSubmit={handleSubmit} className="payment-update-form">
            {error && (
                <div className="error-message" style={{ marginBottom: '0.5rem', fontSize: '0.75rem' }}>
                    {error}
                </div>
            )}

            <div className="form-group">
                <label htmlFor={`payment-${treatmentId}`}>
                    New Amount Paid ({treatmentService.formatCurrency(currentAmount)} → {treatmentService.formatCurrency(newAmount)})
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
                    disabled={isSubmitting}
                />
                <small className="payment-hint">
                    Remaining: {treatmentService.formatCurrency(treatmentService.calculateRemainingBalance(totalCost, newAmount))} of {treatmentService.formatCurrency(totalCost)}
                </small>
            </div>
            <div className="form-actions">
                <button
                    type="submit"
                    className="confirm-btn"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Updating...' : 'Update'}
                </button>
                <button
                    type="button"
                    onClick={handleCancel}
                    className="cancel-btn"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default PaymentUpdateForm;