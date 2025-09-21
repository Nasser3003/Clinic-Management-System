import React from 'react';

interface AppointmentFiltersState {
    status: string;
    doctorName: string;
    patientName: string;
    startDate: string;
    endDate: string;
}

interface AppointmentFiltersProps {
    filters: AppointmentFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<AppointmentFiltersState>>;
    isAdmin: boolean;
    isEmployee: boolean;
}

function AppointmentFilters({ filters, setFilters, isAdmin, isEmployee }: AppointmentFiltersProps) {
    const clearFilters = () => {
        setFilters({
            status: '',
            doctorName: '',
            patientName: '',
            startDate: '',
            endDate: ''
        });
    };

    return (
        <div className="filters-section">
            <div className="filters-grid">
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>

                {(isAdmin || isEmployee) && (
                    <>
                        <div className="filter-group">
                            <label>Doctor Name</label>
                            <input
                                type="text"
                                value={filters.doctorName}
                                onChange={(e) => setFilters(prev => ({ ...prev, doctorName: e.target.value }))}
                                placeholder="Filter by doctor name"
                                className="filter-input"
                            />
                        </div>

                        <div className="filter-group">
                            <label>Patient Name</label>
                            <input
                                type="text"
                                value={filters.patientName}
                                onChange={(e) => setFilters(prev => ({ ...prev, patientName: e.target.value }))}
                                placeholder="Filter by patient name"
                                className="filter-input"
                            />
                        </div>
                    </>
                )}

                <div className="filter-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="filter-input"
                    />
                </div>

                <div className="filter-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="filter-input"
                    />
                </div>
            </div>

            <div className="filter-actions">
                <button
                    onClick={clearFilters}
                    className="clear-filters-btn"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}

export default AppointmentFilters;