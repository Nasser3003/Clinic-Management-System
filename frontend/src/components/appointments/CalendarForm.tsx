import React from 'react';

interface CalendarFormProps {
    onSubmit: (e: React.FormEvent) => void;
    loading: boolean;
    nameLabel: string;
    namePlaceholder: string;
    defaultName?: string;
    defaultStartDate?: string;
    defaultEndDate?: string;
    buttonText: string;
}

function CalendarForm({
                          onSubmit,
                          loading,
                          nameLabel,
                          namePlaceholder,
                          defaultName = '',
                          defaultStartDate,
                          defaultEndDate,
                          buttonText
                      }: CalendarFormProps) {
    const getDefaultStartDate = () => {
        if (defaultStartDate) return defaultStartDate;
        return new Date().toISOString().split('T')[0];
    };

    const getDefaultEndDate = () => {
        if (defaultEndDate) return defaultEndDate;
        return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    };

    return (
        <form onSubmit={onSubmit} className="calendar-form">
            <div className="form-row">
                <div className="form-group">
                    <label>{nameLabel}</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder={namePlaceholder}
                        className="form-input"
                        defaultValue={defaultName}
                    />
                </div>
                <div className="form-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        name="startDate"
                        required
                        className="form-input"
                        defaultValue={getDefaultStartDate()}
                    />
                </div>
                <div className="form-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        name="endDate"
                        required
                        className="form-input"
                        defaultValue={getDefaultEndDate()}
                    />
                </div>
            </div>
            <button type="submit" disabled={loading} className="load-calendar-btn">
                {loading ? 'Loading...' : buttonText}
            </button>
        </form>
    );
}

export default CalendarForm;