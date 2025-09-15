import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../dashboard/shared/DashboardCard';
import AppointmentCard from '../dashboard/shared/AppointmentCard';
import '../css/Dashboard.css';

function DoctorDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'schedule' | 'requests' | 'past'>('schedule');

    // Mock data - replace with API calls
    const todayAppointments = [
        { date: '2024-02-15', time: '9:00 AM', patient: 'John Doe', type: 'Check-up', status: 'upcoming' as const },
        { date: '2024-02-15', time: '10:30 AM', patient: 'Jane Smith', type: 'Follow-up', status: 'upcoming' as const },
        { date: '2024-02-15', time: '2:00 PM', patient: 'Bob Johnson', type: 'Consultation', status: 'upcoming' as const },
    ];

    const pendingRequests = [
        { date: '2024-02-20', time: '10:00 AM', patient: 'Alice Brown', type: 'Consultation', status: 'pending' as const },
        { date: '2024-02-22', time: '3:00 PM', patient: 'Mike Wilson', type: 'Check-up', status: 'pending' as const },
        { date: '2024-02-25', time: '11:00 AM', patient: 'Sarah Davis', type: 'Follow-up', status: 'pending' as const },
    ];

    const pastAppointments = [
        { date: '2024-02-10', time: '9:00 AM', patient: 'Tom Anderson', type: 'Check-up', status: 'completed' as const },
        { date: '2024-02-08', time: '2:00 PM', patient: 'Lisa Garcia', type: 'Follow-up', status: 'completed' as const },
        { date: '2024-02-05', time: '10:30 AM', patient: 'David Lee', type: 'Consultation', status: 'completed' as const },
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
        <div className="doctor-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Good morning, Dr. {user?.lastName}!</h1>
                        <p className="welcome-subtitle">Manage your appointments and patient care</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="doctor-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H9V3H15V9H21ZM17 11C18.1 11 19 11.9 19 13V20C19 21.1 18.1 22 17 22H7C5.9 22 5 21.1 5 20V13C5 11.9 5.9 11 7 11H17Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid doctor-grid">
                <DashboardCard
                    title="Today's Appointments"
                    value={todayAppointments.length}
                    description="Scheduled for today"
                    color="blue"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Pending Requests"
                    value={pendingRequests.length}
                    description="Awaiting your approval"
                    color="yellow"
                    onClick={() => setActiveTab('requests')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="This Week's Total"
                    value="32"
                    description="Total appointments"
                    color="green"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Completed This Month"
                    value={pastAppointments.length * 4}
                    description="Successfully treated"
                    color="purple"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    }
                />
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'schedule' ? 'active' : ''}`}
                        onClick={() => setActiveTab('schedule')}
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
                        className={`tab-button ${activeTab === 'past' ? 'active' : ''}`}
                        onClick={() => setActiveTab('past')}
                    >
                        Past Appointments
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="appointments-section">
                {activeTab === 'schedule' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Today's Schedule</h3>
                            <p className="section-subtitle">Your appointments for today</p>
                        </div>
                        <div className="appointments-list">
                            {todayAppointments.map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={appointment.date}
                                    time={appointment.time}
                                    patient={appointment.patient}
                                    type={appointment.type}
                                    status={appointment.status}
                                    onAction={() => handleViewDetails(`today-${index}`)}
                                    actionLabel="View Patient"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'requests' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Appointment Requests</h3>
                            <p className="section-subtitle">Pending appointments awaiting your approval</p>
                        </div>
                        <div className="appointments-list">
                            {pendingRequests.map((request, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={request.date}
                                    time={request.time}
                                    patient={request.patient}
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

                {activeTab === 'past' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Past Appointments</h3>
                            <p className="section-subtitle">Your completed appointments</p>
                        </div>
                        <div className="appointments-list">
                            {pastAppointments.map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={appointment.date}
                                    time={appointment.time}
                                    patient={appointment.patient}
                                    type={appointment.type}
                                    status={appointment.status}
                                    onAction={() => handleViewDetails(`past-${index}`)}
                                    actionLabel="View Record"
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DoctorDashboard;