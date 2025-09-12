import React from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/Dashboard.css';

function Dashboard() {
    const { user } = useAuth();

    const renderDashboardContent = () => {
        switch (user?.role) {
            case 'ADMIN':
                return <AdminDashboard />;
            case 'EMPLOYEE':
                return <EmployeeDashboard />;
            case 'PATIENT':
                return <PatientDashboard />;
            default:
                return <div className="unknown-role">Unknown user role</div>;
        }
    };

    return (
        <Layout>
            {renderDashboardContent()}
        </Layout>
    );
}

function AdminDashboard() {
    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Admin Dashboard</h2>
            <div className="dashboard-grid admin-grid">
                <DashboardCard
                    title="Total Appointments"
                    value="150"
                    description="This month"
                    color="blue"
                />
                <DashboardCard
                    title="Active Employees"
                    value="12"
                    description="Currently working"
                    color="green"
                />
                <DashboardCard
                    title="Pending Time-offs"
                    value="5"
                    description="Awaiting approval"
                    color="yellow"
                />
            </div>
        </div>
    );
}

function EmployeeDashboard() {
    return (
        <div className="dashboard-container">
            <h2 className="dashboard-title">Employee Dashboard</h2>
            <div className="dashboard-grid employee-grid">
                <DashboardCard
                    title="Today's Appointments"
                    value="8"
                    description="Scheduled for today"
                    color="blue"
                />
                <DashboardCard
                    title="This Week's Schedule"
                    value="32"
                    description="Total appointments"
                    color="green"
                />
            </div>
        </div>
    );
}

function PatientDashboard() {
    const { user } = useAuth();

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
                            <svg className="user-icon" fill="currentColor" viewBox="0 0 24 24">
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
                />
                <DashboardCard
                    title="Past Visits"
                    value="12"
                    description="Completed appointments"
                    color="green"
                />
                <DashboardCard
                    title="Upcoming Visits"
                    value="3"
                    description="Scheduled appointments"
                    color="purple"
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
                        {[
                            { date: '2024-01-15', doctor: 'Dr. Smith', type: 'Check-up', status: 'Completed' },
                            { date: '2023-12-10', doctor: 'Dr. Johnson', type: 'Follow-up', status: 'Completed' },
                            { date: '2023-11-05', doctor: 'Dr. Smith', type: 'Consultation', status: 'Completed' },
                        ].map((visit, index) => (
                            <div key={index} className="visit-item previous-visit">
                                <div className="visit-info">
                                    <div className="visit-icon completed-icon">
                                        <svg className="checkmark-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="visit-details">
                                        <p className="visit-type">{visit.type} with {visit.doctor}</p>
                                        <p className="visit-date">{new Date(visit.date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <span className="visit-status completed-status">
                  {visit.status}
                </span>
                            </div>
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
                        {[
                            { date: '2024-02-15', doctor: 'Dr. Smith', type: 'Annual Check-up', time: '10:30 AM' },
                            { date: '2024-03-10', doctor: 'Dr. Johnson', type: 'Follow-up', time: '2:00 PM' },
                            { date: '2024-04-05', doctor: 'Dr. Wilson', type: 'Consultation', time: '9:00 AM' },
                        ].map((visit, index) => (
                            <div key={index} className="visit-item upcoming-visit">
                                <div className="visit-info">
                                    <div className="visit-icon upcoming-icon">
                                        <svg className="calendar-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="visit-details">
                                        <p className="visit-type">{visit.type} with {visit.doctor}</p>
                                        <p className="visit-date">{new Date(visit.date).toLocaleDateString()} at {visit.time}</p>
                                    </div>
                                </div>
                                <button className="view-details-btn">
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

interface DashboardCardProps {
    title: string;
    value: string;
    description: string;
    color: 'blue' | 'green' | 'yellow' | 'purple';
}

function DashboardCard({ title, value, description, color }: DashboardCardProps) {
    return (
        <div className="dashboard-card">
            <div className="card-content">
                <div className="card-header">
                    <div className="card-icon-container">
                        <div className={`card-icon ${color}-icon`}>
                            <div className="icon-dot"></div>
                        </div>
                    </div>
                    <div className="card-info">
                        <dt className="card-title">{title}</dt>
                        <dd className="card-value">{value}</dd>
                        <dd className="card-description">{description}</dd>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;