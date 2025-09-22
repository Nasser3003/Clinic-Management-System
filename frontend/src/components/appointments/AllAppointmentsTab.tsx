import React, { useMemo } from 'react';
import { Appointment } from '../../types/appointment';
import AppointmentFiltersComponent from "./AppointmentFilters";
import AppointmentsTable from './AppointmentsTable';

interface AppointmentFiltersState {
    status: string;
    doctorName: string;
    patientName: string;
    startDate: string;
    endDate: string;
}

interface AllAppointmentsTabProps {
    appointments: Appointment[];
    loading: boolean;
    error?: string;
    filters: AppointmentFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<AppointmentFiltersState>>;
    isAdmin: boolean;
    isEmployee: boolean;
    isDoctor: boolean;
    onCancelAppointment: (id: string) => void;
    onCompleteAppointment: (id: string) => void;
    onRefresh?: () => void;
}

function AllAppointmentsTab({
                                appointments,
                                loading,
                                error,
                                filters,
                                setFilters,
                                isAdmin,
                                isEmployee,
                                isDoctor,
                                onCancelAppointment,
                                onCompleteAppointment,
                                onRefresh
                            }: AllAppointmentsTabProps) {

    // Calculate statistics for appointments
    const appointmentStats = useMemo(() => {
        if (!appointments.length) return null;

        const total = appointments.length;
        const scheduled = appointments.filter(apt => apt.status === 'SCHEDULED').length;
        const completed = appointments.filter(apt => apt.status === 'COMPLETED').length;
        const canceled = appointments.filter(apt => apt.status === 'CANCELLED').length;

        return { total, scheduled, completed, canceled };
    }, [appointments]);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => value !== '');
    }, [filters]);

    const clearAllFilters = () => {
        setFilters({
            status: '',
            doctorName: '',
            patientName: '',
            startDate: '',
            endDate: ''
        });
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading appointments...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="error-state">
                    <div className="error-icon">⚠️</div>
                    <h4>Error Loading Appointments</h4>
                    <p>{error}</p>
                    {onRefresh && (
                        <button onClick={onRefresh} className="retry-btn">
                            Try Again
                        </button>
                    )}
                </div>
            );
        }

        if (appointments.length === 0) {
            return (
                <div className="empty-state">
                    <div className="empty-icon">📅</div>
                    <h4>No Appointments Found</h4>
                    <p>
                        {hasActiveFilters
                            ? "No appointments match your current filters. Try adjusting your search criteria."
                            : "No appointments have been scheduled yet."
                        }
                    </p>
                </div>
            );
        }

        return (
            <>
                {appointmentStats && (
                    <div className="appointment-stats">
                        <div className="stat-card">
                            <span className="stat-number">{appointmentStats.total}</span>
                            <span className="stat-label">Total</span>
                        </div>
                        <div className="stat-card scheduled">
                            <span className="stat-number">{appointmentStats.scheduled}</span>
                            <span className="stat-label">Scheduled</span>
                        </div>
                        <div className="stat-card completed">
                            <span className="stat-number">{appointmentStats.completed}</span>
                            <span className="stat-label">Completed</span>
                        </div>
                        <div className="stat-card canceled">
                            <span className="stat-number">{appointmentStats.canceled}</span>
                            <span className="stat-label">Canceled</span>
                        </div>
                    </div>
                )}

                <AppointmentsTable
                    appointments={appointments}
                    isAdmin={isAdmin}
                    isDoctor={isDoctor}
                    onCancelAppointment={onCancelAppointment}
                    onCompleteAppointment={onCompleteAppointment}
                />
            </>
        );
    };

    return (
        <div className="all-appointments-section">
            <div className="section-header">
                <div className="header-content">
                    <div>
                        <h3>All Appointments</h3>
                        <p>View and manage all appointments in the system</p>
                    </div>
                </div>
            </div>

            <AppointmentFiltersComponent
                filters={filters}
                setFilters={setFilters}
                isAdmin={isAdmin}
                isEmployee={isEmployee}
            />

            <div className="appointments-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AllAppointmentsTab;