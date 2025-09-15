import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import AdminDashboard from './dashboard/AdminDashboard';
import DoctorDashboard from './dashboard/DoctorDashboard';
import ReceptionistDashboard from './dashboard/ReceptionistDashboard';
import PatientDashboard from './dashboard/PatientDashboard';
import NurseDashboard from './dashboard/NurseDashboard';
import LabTechnicianDashboard from './dashboard/LabTechnicianDashboard';
import EmployeeDashboard from './dashboard/EmployeeDashboard';
import PartnerDashboard from './dashboard/PartnerDashboard';

function Dashboard() {
    const { user } = useAuth();

    const renderDashboardContent = () => {
        switch (user?.role) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'DOCTOR':
                return <DoctorDashboard />;
            case 'NURSE':
                return <NurseDashboard />;
            case 'RECEPTIONIST':
                return <ReceptionistDashboard />;
            case 'EMPLOYEE':
                return <EmployeeDashboard />;
            case 'LAB_TECHNICIAN':
                return <LabTechnicianDashboard />;
            case 'PATIENT':
                return <PatientDashboard />;
            case 'PARTNER':
                return <PartnerDashboard />;
            default:
                return (
                    <div className="unknown-role">
                        <h2>Unknown User Role</h2>
                        <p>Please contact your administrator for access.</p>
                    </div>
                );
        }
    };

    return (
            renderDashboardContent()
    );
}

export default Dashboard;