import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../dashboard/shared/DashboardCard';
import AppointmentCard from '../dashboard/shared/AppointmentCard';
import '../css/dashboard/Dashboard.css';

function ReceptionistDashboard() {
    const { user } = useAuth();
    const [selectedDoctor, setSelectedDoctor] = useState<string>('all');
    const [activeTab, setActiveTab] = useState<'today' | 'requests' | 'upcoming'>('today');

    // Mock data - replace with API calls
    const doctors = [
        { id: 'all', name: 'All Doctors' },
        { id: 'smith', name: 'Dr. Smith' },
        { id: 'johnson', name: 'Dr. Johnson' },
        { id: 'wilson', name: 'Dr. Wilson' },
    ];

    const todayAppointments = [
        { date: '2024-02-15', time: '9:00 AM', patient: 'John Doe', doctor: 'Smith', type: 'Check-up', status: 'upcoming' as const },
        { date: '2024-02-15', time: '10:30 AM', patient: 'Jane Smith', doctor: 'Johnson', type: 'Follow-up', status: 'upcoming' as const },
        { date: '2024-02-15', time: '2:00 PM', patient: 'Bob Johnson', doctor: 'Smith', type: 'Consultation', status: 'upcoming' as const },
        { date: '2024-02-15', time: '3:30 PM', patient: 'Mary Davis', doctor: 'Wilson', type: 'Check-up', status: 'upcoming' as const },
    ];

    const pendingRequests = [
        { date: '2024-02-20', time: '10:00 AM', patient: 'Alice Brown', doctor: 'Smith', type: 'Consultation', status: 'pending' as const },
        { date: '2024-02-22', time: '3:00 PM', patient: 'Mike Wilson', doctor: 'Johnson', type: 'Check-up', status: 'pending' as const },
        { date: '2024-02-25', time: '11:00 AM', patient: 'Sarah Davis', doctor: 'Wilson', type: 'Follow-up', status: 'pending' as const },
    ];

    const upcomingAppointments = [
        { date: '2024-02-16', time: '9:00 AM', patient: 'Tom Anderson', doctor: 'Smith', type: 'Check-up', status: 'upcoming' as const },
        { date: '2024-02-17', time: '2:00 PM', patient: 'Lisa Garcia', doctor: 'Johnson', type: 'Follow-up', status: 'upcoming' as const },
        { date: '2024-02-18', time: '10:30 AM', patient: 'David Lee', doctor: 'Wilson', type: 'Consultation', status: 'upcoming' as const },
    ];

    const filteredAppointments = (appointments: any[]) => {
        if (selectedDoctor === 'all') return appointments;
        return appointments.filter(apt => apt.doctor.toLowerCase() === selectedDoctor);
    };

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

    const handleCheckIn = (appointmentId: string) => {
        console.log('Check in patient:', appointmentId);
        // API call to check in patient
    };

    return (
        <div className="receptionist-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Good morning, {user?.firstName}!</h1>
                        <p className="welcome-subtitle">Manage appointments and patient check-ins</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="receptionist-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM15 7H9C7.9 7 7 7.9 7 9V11H9V20C9 21.1 9.9 22 11 22H13C14.1 22 15 21.1 15 20V11H17V9C17 7.9 16.1 7 15 7Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid receptionist-grid">
                <DashboardCard
                    title="Today's Appointments"
                    value={todayAppointments.length}
                    description="All doctors combined"
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
                    description="Awaiting approval"
                    color="yellow"
                    onClick={() => setActiveTab('requests')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Upcoming This Week"
                    value={upcomingAppointments.length + todayAppointments.length}
                    description="Total scheduled"
                    color="green"
                    onClick={() => setActiveTab('upcoming')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Active Doctors"
                    value={doctors.length - 1}
                    description="Currently available"
                    color="purple"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
            </div>

            {/* Doctor Filter */}
            <div className="filter-section">
                <div className="filter-header">
                    <h3>Filter by Doctor</h3>
                    <select
                        value={selectedDoctor}
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        className="doctor-select"
                    >
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name}
                            </option>
                        ))}
                    </select>
                </div>
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
                        className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        Upcoming Appointments
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="appointments-section">
                {activeTab === 'today' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Today's Schedule</h3>
                            <p className="section-subtitle">
                                {selectedDoctor === 'all' 
                                    ? 'All appointments for today' 
                                    : `${doctors.find(d => d.id === selectedDoctor)?.name}'s appointments`
                                }
                            </p>
                        </div>
                        <div className="appointments-list">
                            {filteredAppointments(todayAppointments).map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={appointment.date}
                                    time={appointment.time}
                                    patient={appointment.patient}
                                    doctor={appointment.doctor}
                                    type={appointment.type}
                                    status={appointment.status}
                                    onAction={() => handleCheckIn(`today-${index}`)}
                                    actionLabel="Check In"
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
                            {filteredAppointments(pendingRequests).map((request, index) => (
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

                {activeTab === 'upcoming' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Upcoming Appointments</h3>
                            <p className="section-subtitle">
                                {selectedDoctor === 'all' 
                                    ? 'All upcoming appointments this week' 
                                    : `${doctors.find(d => d.id === selectedDoctor)?.name}'s upcoming appointments`
                                }
                            </p>
                        </div>
                        <div className="appointments-list">
                            {filteredAppointments(upcomingAppointments).map((appointment, index) => (
                                <AppointmentCard
                                    key={index}
                                    date={appointment.date}
                                    time={appointment.time}
                                    patient={appointment.patient}
                                    doctor={appointment.doctor}
                                    type={appointment.type}
                                    status={appointment.status}
                                    onAction={() => handleViewDetails(`upcoming-${index}`)}
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

export default ReceptionistDashboard;