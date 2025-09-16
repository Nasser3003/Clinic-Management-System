import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from '../dashboard/shared/DashboardCard';
import '../css/Dashboard.css';
import Layout from "../Layout";

function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'doctors' | 'staff'>('overview');
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);

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

    // Close dropdown when clicking outside
    const handleDropdownToggle = () => {
        setShowStaffDropdown(!showStaffDropdown);
    };

    const handleStaffRoleSelect = (role: string) => {
        handleCreateUser(role);
        setShowStaffDropdown(false);
    };

    return (
        <Layout>
            <div className="admin-dashboard">
                {/* Hero Section */}
                <div className="hero-section">
                    <div className="hero-content">
                        <h1 className="hero-title">Admin Dashboard</h1>
                        <p className="hero-subtitle">
                            System administration and user management
                        </p>
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
                                        <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add New User
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
                                            <td data-label="Name">{user.name}</td>
                                            <td data-label="Email">{user.email}</td>
                                            <td data-label="Role">
                                                <span className={`role-badge ${user.role.toLowerCase()}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td data-label="Status">
                                                <span className={`status-badge ${user.status.toLowerCase()}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td data-label="Created">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td data-label="Actions">
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
                                        <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
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
                                            <td data-label="Name">{doctor.name}</td>
                                            <td data-label="Email">{doctor.email}</td>
                                            <td data-label="Specialty">{doctor.specialty}</td>
                                            <td data-label="Patients">{doctor.patients}</td>
                                            <td data-label="Status">
                                                <span className={`status-badge ${doctor.status.toLowerCase()}`}>
                                                    {doctor.status}
                                                </span>
                                            </td>
                                            <td data-label="Actions">
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
                                    <div className="dropdown-container">
                                        <button
                                            className="create-btn dropdown-btn"
                                            onClick={handleDropdownToggle}
                                        >
                                            <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                            </svg>
                                            Add New Staff
                                            <svg className={`dropdown-arrow ${showStaffDropdown ? 'open' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                        {showStaffDropdown && (
                                            <div className="dropdown-menu">
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleStaffRoleSelect('NURSE')}
                                                >
                                                    <svg className="dropdown-icon" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                                    </svg>
                                                    Add Nurse
                                                </button>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleStaffRoleSelect('RECEPTIONIST')}
                                                >
                                                    <svg className="dropdown-icon" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                                    </svg>
                                                    Add Receptionist
                                                </button>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleStaffRoleSelect('LAB_TECHNICIAN')}
                                                >
                                                    <svg className="dropdown-icon" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    Add Lab Technician
                                                </button>
                                                <button
                                                    className="dropdown-item"
                                                    onClick={() => handleStaffRoleSelect('EMPLOYEE')}
                                                >
                                                    <svg className="dropdown-icon" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                                    </svg>
                                                    Add Employee
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
                                            <td data-label="Name">{member.name}</td>
                                            <td data-label="Email">{member.email}</td>
                                            <td data-label="Role">
                                                <span className={`role-badge ${member.role.toLowerCase()}`}>
                                                    {member.role.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td data-label="Department">{member.department}</td>
                                            <td data-label="Status">
                                                <span className={`status-badge ${member.status.toLowerCase()}`}>
                                                    {member.status}
                                                </span>
                                            </td>
                                            <td data-label="Actions">
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
        </Layout>
    );
}

export default AdminDashboard;