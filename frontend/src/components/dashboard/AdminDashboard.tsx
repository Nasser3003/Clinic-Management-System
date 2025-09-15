import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../dashboard/shared/DashboardCard';
import '../css/Dashboard.css';
import {useNavigate} from "react-router-dom";


const quickActions = [
    {
        title: "Manage Appointments",
        description: "View and manage all appointments",
        path: "/appointments/manage",
        roles: ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "EMPLOYEE"],
        icon: "📅",
        color: "blue"
    },
    {
        title: "Treatment Records",
        description: "Track treatments and payments",
        path: "/treatments",
        roles: ["ADMIN", "DOCTOR", "NURSE", "EMPLOYEE"],
        icon: "💊",
        color: "green"
    },
    {
        title: "Time Off Requests",
        description: "Submit and manage time off",
        path: "/timeoff",
        roles: ["ADMIN", "DOCTOR", "NURSE", "RECEPTIONIST", "EMPLOYEE", "LAB_TECHNICIAN"],
        icon: "🏖️",
        color: "purple"
    }
];


function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'doctors' | 'staff'>('overview');

    const navigate = useNavigate();
    const filteredQuickActions = quickActions.filter(action =>
        action.roles.includes(user?.role || '')
    );

    // Mock data - replace with API calls
    const systemStats = {
        totalAppointments: 150,
        totalPatients: 89,
        totalDoctors: 5,
        totalStaff: 12,
        pendingRequests: 8,
        monthlyRevenue: 45000,
    };

    const recentUsers = [
        { id: '1', name: 'John Doe', email: 'john@email.com', role: 'PATIENT', status: 'Active', createdAt: '2024-02-10' },
        { id: '2', name: 'Dr. Sarah Wilson', email: 'sarah@clinic.com', role: 'DOCTOR', status: 'Active', createdAt: '2024-02-08' },
        { id: '3', name: 'Mike Johnson', email: 'mike@clinic.com', role: 'NURSE', status: 'Active', createdAt: '2024-02-05' },
    ];

    const doctors = [
        { id: '1', name: 'Dr. Smith', email: 'smith@clinic.com', specialty: 'General Practice', patients: 45, status: 'Active' },
        { id: '2', name: 'Dr. Johnson', email: 'johnson@clinic.com', specialty: 'Cardiology', patients: 32, status: 'Active' },
        { id: '3', name: 'Dr. Wilson', email: 'wilson@clinic.com', specialty: 'Pediatrics', patients: 28, status: 'Active' },
    ];

    const staff = [
        { id: '1', name: 'Alice Brown', email: 'alice@clinic.com', role: 'RECEPTIONIST', department: 'Front Desk', status: 'Active' },
        { id: '2', name: 'Bob Davis', email: 'bob@clinic.com', role: 'NURSE', department: 'General Care', status: 'Active' },
        { id: '3', name: 'Carol Martinez', email: 'carol@clinic.com', role: 'LAB_TECHNICIAN', department: 'Laboratory', status: 'Active' },
    ];

    const handleCreateUser = (role: string) => {
        console.log('Create new user with role:', role);
        // Navigate to user creation form
    };

    const handleEditUser = (userId: string) => {
        console.log('Edit user:', userId);
        // Navigate to user edit form
    };

    const handleDeactivateUser = (userId: string) => {
        console.log('Deactivate user:', userId);
        // API call to deactivate user
    };

    return (
        <div className="admin-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Admin Dashboard</h1>
                        <p className="welcome-subtitle">System administration and user management</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="admin-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12,15C12.81,15 13.5,14.7 14.11,14.11C14.7,13.5 15,12.81 15,12C15,11.19 14.7,10.5 14.11,9.89C13.5,9.3 12.81,9 12,9C11.19,9 10.5,9.3 9.89,9.89C9.3,10.5 9,11.19 9,12C9,12.81 9.3,13.5 9.89,14.11C10.5,14.7 11.19,15 12,15M12,2C14.21,2 16.21,2.81 17.78,4.39C19.36,5.96 20.17,7.96 20.17,10.17C20.17,12.38 19.36,14.38 17.78,15.95C16.21,17.53 14.21,18.34 12,18.34C9.79,18.34 7.79,17.53 6.22,15.95C4.64,14.38 3.83,12.38 3.83,10.17C3.83,7.96 4.64,5.96 6.22,4.39C7.79,2.81 9.79,2 12,2M12,6.9C11.5,6.9 11.1,7.15 10.85,7.55C10.6,7.95 10.6,8.45 10.85,8.85C11.1,9.25 11.5,9.5 12,9.5C12.5,9.5 12.9,9.25 13.15,8.85C13.4,8.45 13.4,7.95 13.15,7.55C12.9,7.15 12.5,6.9 12,6.9Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* System Overview Stats */}
            <div className="dashboard-grid admin-grid">
                <DashboardCard
                    title="Total Appointments"
                    value={systemStats.totalAppointments}
                    description="This month"
                    color="blue"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Total Patients"
                    value={systemStats.totalPatients}
                    description="Registered users"
                    color="green"
                    onClick={() => setActiveTab('users')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Active Doctors"
                    value={systemStats.totalDoctors}
                    description="Medical practitioners"
                    color="purple"
                    onClick={() => setActiveTab('doctors')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Staff Members"
                    value={systemStats.totalStaff}
                    description="All clinic staff"
                    color="indigo"
                    onClick={() => setActiveTab('staff')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Pending Requests"
                    value={systemStats.pendingRequests}
                    description="Require attention"
                    color="yellow"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Monthly Revenue"
                    value={`$${(systemStats.monthlyRevenue / 1000).toFixed(0)}k`}
                    description="This month"
                    color="green"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                    }
                />
            </div>

            <div className="quick-actions-section">
                <h3 className="section-title">Quick Actions</h3>
                <div className="dashboard-grid quick-actions-grid">
                    {filteredQuickActions.map((action) => (
                        <DashboardCard
                            key={action.path}
                            title={action.title}
                            value={action.icon}
                            description={action.description}
                            color={action.color as "blue" | "green" | "purple" | "yellow" | "red" | "indigo"}
                            onClick={() => navigate(action.path)}
                        />
                    ))}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        System Overview
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
                        onClick={() => setActiveTab('users')}
                    >
                        User Management
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'doctors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctors')}
                    >
                        Doctor Management
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'staff' ? 'active' : ''}`}
                        onClick={() => setActiveTab('staff')}
                    >
                        Staff Management
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="admin-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <div className="section-header">
                            <h3 className="section-title">System Overview</h3>
                            <p className="section-subtitle">Recent activity and system status</p>
                        </div>
                        <div className="recent-activity">
                            <h4>Recent User Registrations</h4>
                            <div className="activity-list">
                                {recentUsers.map((user) => (
                                    <div key={user.id} className="activity-item">
                                        <div className="activity-info">
                                            <p className="activity-title">{user.name}</p>
                                            <p className="activity-subtitle">{user.role} - {user.email}</p>
                                        </div>
                                        <span className="activity-date">{new Date(user.createdAt).toLocaleDateString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="management-section">
                        <div className="section-header">
                            <h3 className="section-title">User Management</h3>
                            <div className="section-actions">
                                <button 
                                    className="create-btn"
                                    onClick={() => handleCreateUser('PATIENT')}
                                >
                                    Create New User
                                </button>
                            </div>
                        </div>
                        <div className="users-table">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Status</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${user.status.toLowerCase()}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => handleEditUser(user.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="deactivate-btn"
                                                        onClick={() => handleDeactivateUser(user.id)}
                                                    >
                                                        Deactivate
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'doctors' && (
                    <div className="management-section">
                        <div className="section-header">
                            <h3 className="section-title">Doctor Management</h3>
                            <div className="section-actions">
                                <button 
                                    className="create-btn"
                                    onClick={() => handleCreateUser('DOCTOR')}
                                >
                                    Add New Doctor
                                </button>
                            </div>
                        </div>
                        <div className="doctors-table">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Specialty</th>
                                        <th>Patients</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td>{doctor.name}</td>
                                            <td>{doctor.email}</td>
                                            <td>{doctor.specialty}</td>
                                            <td>{doctor.patients}</td>
                                            <td>
                                                <span className={`status-badge ${doctor.status.toLowerCase()}`}>
                                                    {doctor.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => handleEditUser(doctor.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="view-btn"
                                                        onClick={() => console.log('View doctor schedule:', doctor.id)}
                                                    >
                                                        Schedule
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'staff' && (
                    <div className="management-section">
                        <div className="section-header">
                            <h3 className="section-title">Staff Management</h3>
                            <div className="section-actions">
                                <select 
                                    className="role-select"
                                    onChange={(e) => {
                                        if (e.target.value) {
                                            handleCreateUser(e.target.value);
                                            e.target.value = '';
                                        }
                                    }}
                                    defaultValue=""
                                >
                                    <option value="" disabled>Add New Staff</option>
                                    <option value="NURSE">Add Nurse</option>
                                    <option value="RECEPTIONIST">Add Receptionist</option>
                                    <option value="LAB_TECHNICIAN">Add Lab Technician</option>
                                    <option value="EMPLOYEE">Add Employee</option>
                                </select>
                            </div>
                        </div>
                        <div className="staff-table">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Department</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {staff.map((member) => (
                                        <tr key={member.id}>
                                            <td>{member.name}</td>
                                            <td>{member.email}</td>
                                            <td>
                                                <span className={`role-badge ${member.role.toLowerCase()}`}>
                                                    {member.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td>{member.department}</td>
                                            <td>
                                                <span className={`status-badge ${member.status.toLowerCase()}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button 
                                                        className="edit-btn"
                                                        onClick={() => handleEditUser(member.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button 
                                                        className="deactivate-btn"
                                                        onClick={() => handleDeactivateUser(member.id)}
                                                    >
                                                        Deactivate
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;