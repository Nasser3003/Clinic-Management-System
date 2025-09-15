import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './shared/DashboardCard';
import AppointmentCard from './shared/AppointmentCard';
import '../css/Dashboard.css';

function EmployeeDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'today' | 'requests' | 'schedule'>('today');

    // Mock data - replace with API calls
    const todayAppointments = [
        { date: '2024-02-15', time: '9:00 AM', patient: 'John Doe', doctor: 'Smith', type: 'Check-up', status: 'upcoming' as const },
        { date: '2024-02-15', time: '10:30 AM', patient: 'Jane Smith', doctor: 'Johnson', type: 'Follow-up', status: 'upcoming' as const },
        { date: '2024-02-15', time: '2:00 PM', patient: 'Bob Johnson', doctor: 'Smith', type: 'Consultation', status: 'upcoming' as const },
    ];

    const pendingRequests = [
        { date: '2024-02-20', time: '10:00 AM', patient: 'Alice Brown', doctor: 'Smith', type: 'Consultation', status: 'pending' as const },
        { date: '2024-02-22', time: '3:00 PM', patient: 'Mike Wilson', doctor: 'Johnson', type: 'Check-up', status: 'pending' as const },
    ];

    const weeklySchedule = [
        { date: '2024-02-16', time: '9:00 AM', patient: 'Tom Anderson', doctor: 'Smith', type: 'Check-up', status: 'upcoming' as const },
        { date: '2024-02-17', time: '2:00 PM', patient: 'Lisa Garcia', doctor: 'Johnson', type: 'Follow-up', status: 'upcoming' as const },
        { date: '2024-02-18', time: '10:30 AM', patient: 'David Lee', doctor: 'Wilson', type: 'Consultation', status: 'upcoming' as const },
    ];

    const handleApproveRequest = (appointmentId: string) => {
        console.log('Approve appointment:', appointmentId);
        // API call to approve appointment
    };

    const handleDenyRequest = (appointmentId: string) => {
        console.log('Deny appointment:', appointmentId);
        // API call to deny appointment
    };

    const handleViewDetails = (appointmentId: string) => {
        console.log('View appointment details:', appointmentId);
        // Navigate to appointment details page
    };

    return (
        <div className="employee-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Good morning, {user?.firstName}!</h1>
                        <p className="welcome-subtitle">Clinic operations and appointment management</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="employee-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16,4C16.88,4 17.67,4.38 18.18,5L20.5,7.32L16.68,11.14L14.36,8.82L16,4M12,8L8,12L20,24L24,20L12,8Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid employee-grid">
                <DashboardCard
                    title="Today's Appointments"
                    value={todayAppointments.length}
                    description="Scheduled for today"
                    color="blue"
                    onClick={() => setActiveTab('today')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Pending Requests"
                    value={pendingRequests.length}
                    description="Need approval"
                    color="yellow"
                    onClick={() => setActiveTab('requests')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="This Week"
                    value={weeklySchedule.length + todayAppointments.length}
                    description="Total appointments"
                    color="green"
                    onClick={() => setActiveTab('schedule')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                />
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'today' ? 'active' : ''}`}
                        onClick={() => setActiveTab('today')}
                    >
                        Today's Schedule
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
                        onClick={() => setActiveTab('requests')}
                    >
                        Appointment Requests ({pendingRequests.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
                    >
                        Weekly Schedule
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="employee-content">
                {activeTab === 'today' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Today's Appointments</h3>
                            <p className="section-subtitle">All appointments scheduled for today</p>
                        </div>
                        <div className="appointments-list">
                            {todayAppointments.map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={appointment.date}
                                    time={appointment.time}
                                    patient={appointment.patient}
                                    doctor={appointment.doctor}
                                    type={appointment.type}
                                    status={appointment.status}
                                    onAction={() => handleViewDetails(`today-${index}`)}
                                    actionLabel="View Details"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Appointment Requests</h3>
                            <p className="section-subtitle">Pending appointments awaiting approval</p>
                        </div>
                        <div className="appointments-list">
                            {pendingRequests.map((request, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={request.date}
                                    time={request.time}
                                    patient={request.patient}
                                    doctor={request.doctor}
                                    type={request.type}
                                    status={request.status}
                                    showApprovalButtons={true}
                                    onApprove={() => handleApproveRequest(`request-${index}`)}
                                    onDeny={() => handleDenyRequest(`request-${index}`)}
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'schedule' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Weekly Schedule</h3>
                        </div>
                        <div className="appointments-list">
                            {weeklySchedule.map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={appointment.date}
                                    time={appointment.time}
                                    patient={appointment.patient}
                                    doctor={appointment.doctor}
                                    type={appointment.type}
                                    status={appointment.status}
                                    onAction={() => handleViewDetails(`weekly-${index}`)}
                                    actionLabel="View Details"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeDashboard;