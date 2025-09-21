import React from 'react';
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
    filters: AppointmentFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<AppointmentFiltersState>>;
    isAdmin: boolean;
    isEmployee: boolean;
    isDoctor: boolean;
    onCancelAppointment: (id: string) => void;
    onCompleteAppointment: (id: string) => void;
}

function AllAppointmentsTab({
                                appointments,
                                loading,
                                filters,
                                setFilters,
                                isAdmin,
                                isEmployee,
                                isDoctor,
                                onCancelAppointment,
                                onCompleteAppointment
                            }: AllAppointmentsTabProps) {
    return (
        <div className="all-appointments-section">
            <div className="section-header">
                <h3>All Appointments</h3>
                <p>View and filter all appointments in the system</p>
            </div>

            <AppointmentFiltersComponent
                filters={filters}
                setFilters={setFilters}
                isAdmin={isAdmin}
                isEmployee={isEmployee}
            />

            {loading ? (
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading appointments...</p>
                </div>
            ) : appointments.length === 0 ? (
                <div className="empty-state">
                    <p>No appointments found with the current filters</p>
                </div>
            ) : (
                <AppointmentsTable
                    appointments={appointments}
                    isAdmin={isAdmin}
                    isDoctor={isDoctor}
                    onCancelAppointment={onCancelAppointment}
                    onCompleteAppointment={onCompleteAppointment}
                />
            )}
        </div>
    );
}

export default AllAppointmentsTab;