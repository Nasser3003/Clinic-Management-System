import React, { useState, useEffect, useMemo } from 'react';
import { Appointment } from '../../types/appointment';
import AppointmentFilters from './AppointmentFilters';
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
    isAdmin: boolean;
    isDoctor: boolean;
    onCancelAppointment: (id: string) => void;
    onCompleteAppointment: (id: string) => void;
}

function AllAppointmentsTab({
                                appointments,
                                isAdmin,
                                isDoctor,
                                onCancelAppointment,
                                onCompleteAppointment
                            }: AllAppointmentsTabProps) {
    const [filters, setFilters] = useState<AppointmentFiltersState>({
        status: '',
        doctorName: '',
        patientName: '',
        startDate: '',
        endDate: ''
    });
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(appointments);

    // Handle status filter toggle
    const handleStatusToggle = (status: string) => {
        setFilters(prev => ({
            ...prev,
            status: prev.status === status ? '' : status
        }));
    };

    // Filter appointments based on current filters
    useEffect(() => {
        let filtered = [...appointments];

        // Filter by status
        if (filters.status)
            filtered = filtered.filter(apt => apt.status === filters.status);

        // Filter by doctor name
        if (filters.doctorName)
            filtered = filtered.filter(apt =>
                apt.doctorName.toLowerCase().includes(filters.doctorName.toLowerCase())
            );

        // Filter by patient name
        if (filters.patientName)
            filtered = filtered.filter(apt =>
                apt.patientName.toLowerCase().includes(filters.patientName.toLowerCase())
            );

        // Filter by start date
        if (filters.startDate) {
            filtered = filtered.filter(apt => {
                const aptDate = new Date(apt.startDateTime).toISOString().split('T')[0];
                return aptDate >= filters.startDate;
            });
        }

        // Filter by end date
        if (filters.endDate) {
            filtered = filtered.filter(apt => {
                const aptDate = new Date(apt.startDateTime).toISOString().split('T')[0];
                return aptDate <= filters.endDate;
            });
        }

        setFilteredAppointments(filtered);
    }, [appointments, filters]);

    // Calculate statistics for appointments
    const appointmentStats = useMemo(() => {
        const total = filteredAppointments.length;
        const scheduled = filteredAppointments.filter(apt => apt.status === 'SCHEDULED').length;
        const completed = filteredAppointments.filter(apt => apt.status === 'COMPLETED').length;
        const canceled = filteredAppointments.filter(apt => apt.status === 'CANCELED').length;

        return { total, scheduled, completed, canceled };
    }, [filteredAppointments]);

    // Check if any filters are active
    const hasActiveFilters = useMemo(() => {
        return Object.values(filters).some(value => value !== '');
    }, [filters]);

    const renderContent = () => {
        return (
            <>
                {/* Always show stats cards */}
                <div className="appointment-stats">
                    <div
                        className={`stat-card ${filters.status === '' ? 'active' : ''}`}
                        onClick={() => handleStatusToggle('')}
                    >
                        <span className="stat-number">
                            {filters.status ? '--' : appointmentStats.total}
                        </span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div
                        className={`stat-card scheduled ${filters.status === 'SCHEDULED' ? 'active' : ''}`}
                        onClick={() => handleStatusToggle('SCHEDULED')}
                    >
                        <span className="stat-number">{appointmentStats.scheduled}</span>
                        <span className="stat-label">Scheduled</span>
                    </div>
                    <div
                        className={`stat-card completed ${filters.status === 'COMPLETED' ? 'active' : ''}`}
                        onClick={() => handleStatusToggle('COMPLETED')}
                    >
                        <span className="stat-number">{appointmentStats.completed}</span>
                        <span className="stat-label">Completed</span>
                    </div>
                    <div
                        className={`stat-card canceled ${filters.status === 'CANCELED' ? 'active' : ''}`}
                        onClick={() => handleStatusToggle('CANCELED')}
                    >
                        <span className="stat-number">{appointmentStats.canceled}</span>
                        <span className="stat-label">Canceled</span>
                    </div>
                </div>

                {/* Show table or empty state */}
                {filteredAppointments.length === 0 ? (
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
                ) : (
                    <AppointmentsTable
                        appointments={filteredAppointments}
                        isAdmin={isAdmin}
                        isDoctor={isDoctor}
                        onCancelAppointment={onCancelAppointment}
                        onCompleteAppointment={onCompleteAppointment}
                    />
                )}
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

            <AppointmentFilters
                filters={filters}
                setFilters={setFilters}
                isAdmin={isAdmin}
                isEmployee={true}
            />

            <div className="appointments-content">
                {renderContent()}
            </div>
        </div>
    );
}

export default AllAppointmentsTab;