import React, {useEffect, useState} from 'react';
import {useAuth} from '../../context/AuthContext';
import DashboardCard from '../dashboard/shared/DashboardCard';
import '../css/dashboard/Dashboard.css';
import HeroHeader from "../common/HeroHeader";
import {adminService} from '../../services/adminService';
import {EmployeeDTO} from "../../types/admin";

function AdminDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'patients' | 'doctors' | 'staff' | 'system'>('overview');
    const [showStaffDropdown, setShowStaffDropdown] = useState(false);
    const [doctors, setDoctors] = useState<EmployeeDTO[]>([]);
    const [staff, setStaff] = useState<EmployeeDTO[]>([]);
    const [patients, setPatients] = useState<EmployeeDTO[]>([]);

    // System stats - only fetch counts from API
    const [systemStats, setSystemStats] = useState({
        totalAppointments: 0,
        totalPatients: 0,
        totalDoctors: 0,
        totalStaff: 0,
        pendingRequests: 8,
        monthlyRevenue: 0,
    });

    // Mock data for recent users
    const recentUsers = [
        { id: '1', name: 'John Doe', email: 'john@email.com', userType: 'PATIENT', status: 'Active', createdAt: '2024-02-10' },
        { id: '2', name: 'Dr. Sarah Wilson', email: 'sarah@clinic.com', userType: 'DOCTOR', status: 'Active', createdAt: '2024-02-08' },
        { id: '3', name: 'Mike Johnson', email: 'mike@clinic.com', userType: 'NURSE', status: 'Active', createdAt: '2024-02-05' },
        { id: '4', name: 'Emily Davis', email: 'emily@clinic.com', userType: 'PATIENT', status: 'Active', createdAt: '2024-02-12' },
        { id: '5', name: 'Lisa Brown', email: 'lisa@clinic.com', userType: 'RECEPTIONIST', status: 'Active', createdAt: '2024-02-09' },
    ];

    // Filter data by user type
    const patientData = recentUsers.filter(user => user.userType === 'PATIENT');

    // Fetch counts from API on component mount
    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const [doctorsCount, patientsCount, staffCount, appointmentsCount, doctorsData, staffData, patientsData] = await Promise.all([
                    adminService.getActiveDoctorsCount(),
                    adminService.getActivePatientsCount(),
                    adminService.getActiveStaffCount(),
                    adminService.getAppointmentsThisMonthCount(),
                    adminService.getAllDoctors(),
                    adminService.getAllStaff(),
                    adminService.getAllPatients()
                ]);

                setSystemStats(prev => ({
                    ...prev,
                    totalDoctors: doctorsCount,
                    totalPatients: patientsCount,
                    totalStaff: staffCount,
                    totalAppointments: appointmentsCount
                }));

                setDoctors(doctorsData);
                setStaff(staffData);
                setPatients(patientsData);

            } catch (error) {
                console.error('Error fetching counts:', error);
            }
        };

        fetchCounts();
    }, []);

    const handleCreateUser = (userType: string) => {
        console.log('Create new user with userType:', userType);
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

    const handleViewMedicalHistory = (patientId: string) => {
        console.log('View medical history for patient:', patientId);
        // Navigate to medical history
    };

    const handleManagePermissions = (userId: string) => {
        console.log('Manage permissions for user:', userId);
        // Navigate to permission management
    };

    // Close dropdown when clicking outside
    const handleDropdownToggle = () => {
        setShowStaffDropdown(!showStaffDropdown);
    };

    const handleStaffRoleSelect = (userType: string) => {
        handleCreateUser(userType);
        setShowStaffDropdown(false);
    };

    return (
        <div>
            <HeroHeader
                title="Admin Dashboard"
                subtitle="System administration and user management"
            />

            <div className="admin-dashboard">
                {/* System Overview Stats */}
                <div className="dashboard-grid admin-grid">
                    <DashboardCard
                        title="Total Appointments"
                        value={systemStats.totalAppointments || 0}
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
                        description="Registered patients"
                        color="green"
                        onClick={() => setActiveTab('patients')}
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
                        value={systemStats.pendingRequests || 0}
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
                        value={systemStats.monthlyRevenue ? `$${(systemStats.monthlyRevenue / 1000).toFixed(0)}k` : '$0'}
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
                            className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
                            onClick={() => setActiveTab('patients')}
                        >
                            Patient Management
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
                        <button
                            className={`tab-button ${activeTab === 'system' ? 'active' : ''}`}
                            onClick={() => setActiveTab('system')}
                        >
                            System Administration
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
                                                <p className="activity-subtitle">{user.userType} - {user.email}</p>
                                            </div>
                                            <span className="activity-date">{new Date(user.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'patients' && (
                        <div className="management-section">
                            <div className="section-header">
                                <h3 className="section-title">Patient Management</h3>
                                <div className="section-actions">
                                    <button
                                        className="create-btn"
                                        onClick={() => handleCreateUser('PATIENT')}
                                    >
                                        <svg className="btn-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Register New Patient
                                    </button>
                                </div>
                            </div>
                            <div className="patients-table">
                                <table className="admin-table">
                                    <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Status</th>
                                        <th>Registered</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {patients.map((patient) => (
                                        <tr key={patient.id}>
                                            <td data-label="Name">{patient.firstName} {patient.lastName}</td>
                                            <td data-label="Email">{patient.email}</td>
                                            <td data-label="Phone">+1 (555) 123-4567</td>
                                            <td data-label="Registered">
                                                {new Date(patient.createDate).toLocaleDateString()}
                                            </td>
                                            <td data-label="Actions">
                                                <div className="action-buttons">
                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEditUser(patient.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="view-btn"
                                                        onClick={() => handleViewMedicalHistory(patient.id)}
                                                    >
                                                        Medical History
                                                    </button>
                                                    <button
                                                        className="deactivate-btn"
                                                        onClick={() => handleDeactivateUser(patient.id)}
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
                                        <th>Department</th>
                                        <th>Salary</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {doctors.map((doctor) => (
                                        <tr key={doctor.id}>
                                            <td data-label="Name">{doctor.firstName} {doctor.lastName}</td>
                                            <td data-label="Email">{doctor.email}</td>
                                            <td data-label="Department">{doctor.department || 'N/A'}</td>
                                            <td data-label="Salary">${doctor.salary.toLocaleString()}</td>
                                            <td data-label="Status">
                                                <span className={`status-badge ${doctor.isEnabled ? 'active' : 'inactive'}`}>
                                                    {doctor.isEnabled ? 'Active' : 'Inactive'}
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
                                                    <button
                                                        className="view-btn"
                                                        onClick={() => handleManagePermissions(doctor.id)}
                                                    >
                                                        Permissions
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
                                            <td data-label="Name">{member.firstName} {member.lastName}</td>
                                            <td data-label="Email">{member.email}</td>
                                            <td data-label="Role">
                                                <span className={`role-badge ${member.userType.toLowerCase()}`}>
                                                    {member.userType.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td data-label="Department">{member.department || 'N/A'}</td>
                                            <td data-label="Status">
                                                <span className={`status-badge ${member.isEnabled ? 'active' : 'inactive'}`}>
                                                    {member.isEnabled ? 'Active' : 'Inactive'}
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
                                                        className="view-btn"
                                                        onClick={() => handleManagePermissions(member.id)}
                                                    >
                                                        Permissions
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

                    {activeTab === 'system' && (
                        <div className="management-section">
                            <div className="section-header">
                                <h3 className="section-title">System Administration</h3>
                                <p className="section-subtitle">Advanced system configuration and security</p>
                            </div>

                            <div className="system-admin-grid">
                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>User Permissions</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>Manage user permissions and access control</p>
                                    <button className="admin-action-btn">Manage Permissions</button>
                                </div>

                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>System Configuration</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>Configure system settings and preferences</p>
                                    <button className="admin-action-btn">System Settings</button>
                                </div>

                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>Audit Logs</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H14a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2h1a1 1 0 100-2h-1a4 4 0 00-4 4v1H6V3a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V6a2 2 0 00-2-2V3a2 2 0 012-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>View system activity and user action logs</p>
                                    <button className="admin-action-btn">View Logs</button>
                                </div>

                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>Backup & Recovery</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                                            <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>Manage system backups and data recovery</p>
                                    <button className="admin-action-btn">Backup Settings</button>
                                </div>

                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>Security Settings</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>Configure security policies and access controls</p>
                                    <button className="admin-action-btn">Security Config</button>
                                </div>

                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>System Health</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p>Monitor system performance and health metrics</p>
                                    <button className="admin-action-btn">Health Dashboard</button>
                                </div>

                                <div className="admin-card">
                                    <div className="admin-card-header">
                                        <h4>Database Management</h4>
                                        <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                                        </svg>
                                    </div>
                                    <p>Database maintenance and optimization tools</p>
                                    <button className="admin-action-btn">Database Tools</button>
                                </div>
                            </div>

                            <div className="system-stats-section">
                                <h4>System Status</h4>
                                <div className="status-grid">
                                    <div className="status-item">
                                        <span className="status-label">Database Status</span>
                                        <span className="status-value healthy">Healthy</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">API Response Time</span>
                                        <span className="status-value">124ms</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">Active Sessions</span>
                                        <span className="status-value">47</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">Storage Used</span>
                                        <span className="status-value">68%</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">Last Backup</span>
                                        <span className="status-value">2 hours ago</span>
                                    </div>
                                    <div className="status-item">
                                        <span className="status-label">Security Alerts</span>
                                        <span className="status-value warning">2 pending</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;