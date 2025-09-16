import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './shared/DashboardCard';
import AppointmentCard from './shared/AppointmentCard';
import '../css/dashboard/Dashboard.css';

function NurseDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'today' | 'patients' | 'tasks'>('today');

    // Mock data - replace with API calls
    const todayAppointments = [
        { date: '2024-02-15', time: '9:00 AM', patient: 'John Doe', doctor: 'Smith', type: 'Pre-appointment Check', status: 'upcoming' as const },
        { date: '2024-02-15', time: '10:30 AM', patient: 'Jane Smith', doctor: 'Johnson', type: 'Vital Signs', status: 'upcoming' as const },
        { date: '2024-02-15', time: '2:00 PM', patient: 'Bob Johnson', doctor: 'Smith', type: 'Post-consultation Care', status: 'upcoming' as const },
    ];

    const assignedPatients = [
        { id: '1', name: 'John Doe', room: '101', condition: 'Recovery', lastVisit: '2024-02-10', priority: 'normal' },
        { id: '2', name: 'Jane Smith', room: '102', condition: 'Monitoring', lastVisit: '2024-02-12', priority: 'high' },
        { id: '3', name: 'Bob Johnson', room: '103', condition: 'Stable', lastVisit: '2024-02-14', priority: 'low' },
    ];

    const nurseTasks = [
        { id: '1', task: 'Administer medication to Room 101', patient: 'John Doe', time: '10:00 AM', priority: 'high', status: 'pending' },
        { id: '2', task: 'Take vital signs for Room 102', patient: 'Jane Smith', time: '11:30 AM', priority: 'normal', status: 'pending' },
        { id: '3', task: 'Wound dressing change Room 103', patient: 'Bob Johnson', time: '2:00 PM', priority: 'normal', status: 'pending' },
        { id: '4', task: 'Post-op checkup Room 104', patient: 'Alice Brown', time: '3:30 PM', priority: 'high', status: 'completed' },
    ];

    const handleCompleteTask = (taskId: string) => {
        console.log('Complete task:', taskId);
        // API call to mark task as completed
    };

    const handleViewPatient = (patientId: string) => {
        console.log('View patient details:', patientId);
        // Navigate to patient details page
    };

    const handleViewAppointment = (appointmentId: string) => {
        console.log('View appointment details:', appointmentId);
        // Navigate to appointment details page
    };

    return (
        <div className="nurse-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Good morning, Nurse {user?.lastName}!</h1>
                        <p className="welcome-subtitle">Patient care and nursing tasks management</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="nurse-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,2A3,3 0 0,1 15,5V9A3,3 0 0,1 12,12A3,3 0 0,1 9,9V5A3,3 0 0,1 12,2M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid nurse-grid">
                <DashboardCard
                    title="Today's Patients"
                    value={todayAppointments.length}
                    description="Scheduled appointments"
                    color="blue"
                    onClick={() => setActiveTab('today')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Assigned Patients"
                    value={assignedPatients.length}
                    description="Under your care"
                    color="green"
                    onClick={() => setActiveTab('patients')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Pending Tasks"
                    value={nurseTasks.filter(task => task.status === 'pending').length}
                    description="Need attention"
                    color="yellow"
                    onClick={() => setActiveTab('tasks')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="High Priority"
                    value={assignedPatients.filter(p => p.priority === 'high').length + nurseTasks.filter(t => t.priority === 'high' && t.status === 'pending').length}
                    description="Urgent attention needed"
                    color="red"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
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
                        className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patients')}
                    >
                        Assigned Patients
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
                        onClick={() => setActiveTab('tasks')}
                    >
                        Nursing Tasks ({nurseTasks.filter(t => t.status === 'pending').length})
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="nurse-content">
                {activeTab === 'today' && (
                    <div className="appointments-content">
                        <div className="section-header">
                            <h3 className="section-title">Today's Patient Care Schedule</h3>
                            <p className="section-subtitle">Your nursing assignments for today</p>
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
                                    onAction={() => handleViewAppointment(`today-${index}`)}
                                    actionLabel="Start Care"
                                />
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'patients' && (
                    <div className="patients-content">
                        <div className="section-header">
                            <h3 className="section-title">Assigned Patients</h3>
                            <p className="section-subtitle">Patients under your nursing care</p>
                        </div>
                        <div className="patients-list">
                            {assignedPatients.map((patient) => (
                                <div key={patient.id} className="patient-card">
                                    <div className="patient-info">
                                        <div className={`priority-indicator ${patient.priority}`}></div>
                                        <div className="patient-details">
                                            <h4 className="patient-name">{patient.name}</h4>
                                            <p className="patient-room">Room {patient.room} - {patient.condition}</p>
                                            <p className="patient-last-visit">Last visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    <div className="patient-actions">
                                        <span className={`priority-badge ${patient.priority}`}>
                                            {patient.priority.charAt(0).toUpperCase() + patient.priority.slice(1)} Priority
                                        </span>
                                        <button 
                                            className="view-patient-btn"
                                            onClick={() => handleViewPatient(patient.id)}
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'tasks' && (
                    <div className="tasks-content">
                        <div className="section-header">
                            <h3 className="section-title">Nursing Tasks</h3>
                            <p className="section-subtitle">Your assigned nursing duties and care tasks</p>
                        </div>
                        <div className="tasks-list">
                            {nurseTasks.map((task) => (
                                <div key={task.id} className={`task-card ${task.status}`}>
                                    <div className="task-info">
                                        <div className={`task-priority ${task.priority}`}>
                                            {task.priority === 'high' && (
                                                <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '16px', height: '16px' }}>
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="task-details">
                                            <h4 className="task-title">{task.task}</h4>
                                            <p className="task-patient">Patient: {task.patient}</p>
                                            <p className="task-time">Scheduled: {task.time}</p>
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        <span className={`priority-badge ${task.priority}`}>
                                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                                        </span>
                                        {task.status === 'pending' ? (
                                            <button 
                                                className="complete-task-btn"
                                                onClick={() => handleCompleteTask(task.id)}
                                            >
                                                Mark Complete
                                            </button>
                                        ) : (
                                            <span className="task-status completed">
                                                ✓ Completed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default NurseDashboard;