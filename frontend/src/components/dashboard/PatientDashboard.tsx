import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../dashboard/shared/DashboardCard';
import AppointmentCard from '../dashboard/shared/AppointmentCard';
import '../css/Dashboard.css';

function PatientDashboard() {
    const { user } = useAuth();

    // Mock data - replace with API calls
    const previousVisits = [
        { date: '2024-01-15', doctor: 'Smith', type: 'Annual Check-up', status: 'completed' as const },
        { date: '2023-12-10', doctor: 'Johnson', type: 'Follow-up', status: 'completed' as const },
        { date: '2023-11-05', doctor: 'Smith', type: 'Consultation', status: 'completed' as const },
    ];

    const upcomingVisits = [
        { date: '2024-02-15', doctor: 'Smith', type: 'Annual Check-up', time: '10:30 AM', status: 'upcoming' as const },
        { date: '2024-03-10', doctor: 'Johnson', type: 'Follow-up', time: '2:00 PM', status: 'upcoming' as const },
        { date: '2024-04-05', doctor: 'Wilson', type: 'Consultation', time: '9:00 AM', status: 'upcoming' as const },
    ];

    const handleViewDetails = (appointmentId?: string) => {
        console.log('View appointment details:', appointmentId);
        // Navigate to appointment details page
    };

    return (
        <div className="patient-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Welcome back, {user?.firstName}!</h1>
                        <p className="welcome-subtitle">Manage your health appointments and medical records</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            {user?.email ? (
                                <img
                                    src={`http://localhost:3001/files/avatar/${encodeURIComponent(user.email)}`}
                                    alt="Profile"
                                    className="user-icon"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        const svg = target.nextElementSibling as HTMLElement;
                                        if (svg) svg.style.display = 'block';
                                    }}
                                    onLoad={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        const svg = target.nextElementSibling as HTMLElement;
                                        if (svg) svg.style.display = 'none';
                                    }}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        borderRadius: '50%'
                                    }}
                                />
                            ) : null}
                            <svg
                                className="user-icon"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                style={{ display: user?.email ? 'none' : 'block' }}
                            >
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid patient-grid">
                <DashboardCard
                    title="Next Appointment"
                    value="Tomorrow"
                    description="10:30 AM with Dr. Smith"
                    color="blue"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Past Visits"
                    value={previousVisits.length}
                    description="Completed appointments"
                    color="green"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Upcoming Visits"
                    value={upcomingVisits.length}
                    description="Scheduled appointments"
                    color="purple"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    }
                />
            </div>

            {/* Previous Visits Section */}
            <div className="visits-section">
                <div className="section-header previous-header">
                    <h3 className="section-title">Previous Visits</h3>
                    <p className="section-subtitle">Your completed medical appointments</p>
                </div>
                <div className="visits-content">
                    <div className="visits-list">
                        {previousVisits.map((visit, index) => (
                            <AppointmentCard
                                key={index}
                                date={visit.date}
                                doctor={visit.doctor}
                                type={visit.type}
                                status={visit.status}
                                onAction={() => handleViewDetails(`prev-${index}`)}
                                actionLabel="View Details"
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Future Visits Section */}
            <div className="visits-section">
                <div className="section-header upcoming-header">
                    <h3 className="section-title">Upcoming Visits</h3>
                    <p className="section-subtitle">Your scheduled medical appointments</p>
                </div>
                <div className="visits-content">
                    <div className="visits-list">
                        {upcomingVisits.map((visit, index) => (
                            <AppointmentCard
                                key={index}
                                date={visit.date}
                                time={visit.time}
                                doctor={visit.doctor}
                                type={visit.type}
                                status={visit.status}
                                onAction={() => handleViewDetails(`upcoming-${index}`)}
                                actionLabel="View Details"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PatientDashboard;