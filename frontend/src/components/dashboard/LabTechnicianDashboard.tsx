import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './shared/DashboardCard';
import '../css/Dashboard.css';

function LabTechnicianDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'pending' | 'inprogress' | 'completed'>('pending');

    // Mock data - replace with API calls
    const labTests = [
        { id: '1', testType: 'Blood Panel', patient: 'John Doe', doctor: 'Dr. Smith', priority: 'high', status: 'pending', orderDate: '2024-02-15', estimatedTime: '2 hours' },
        { id: '2', testType: 'Urinalysis', patient: 'Jane Smith', doctor: 'Dr. Johnson', priority: 'normal', status: 'pending', orderDate: '2024-02-15', estimatedTime: '1 hour' },
        { id: '3', testType: 'X-Ray Chest', patient: 'Bob Johnson', doctor: 'Dr. Wilson', priority: 'urgent', status: 'inprogress', orderDate: '2024-02-15', estimatedTime: '30 mins' },
        { id: '4', testType: 'MRI Scan', patient: 'Alice Brown', doctor: 'Dr. Smith', priority: 'normal', status: 'inprogress', orderDate: '2024-02-14', estimatedTime: '1.5 hours' },
        { id: '5', testType: 'Blood Sugar', patient: 'Mike Wilson', doctor: 'Dr. Johnson', priority: 'normal', status: 'completed', orderDate: '2024-02-14', completedTime: '45 mins' },
        { id: '6', testType: 'ECG', patient: 'Sarah Davis', doctor: 'Dr. Wilson', priority: 'high', status: 'completed', orderDate: '2024-02-14', completedTime: '20 mins' },
    ];

    const equipment = [
        { id: '1', name: 'Blood Analyzer', status: 'operational', lastMaintenance: '2024-02-10', nextMaintenance: '2024-03-10' },
        { id: '2', name: 'X-Ray Machine', status: 'operational', lastMaintenance: '2024-02-05', nextMaintenance: '2024-03-05' },
        { id: '3', name: 'MRI Scanner', status: 'maintenance', lastMaintenance: '2024-02-14', nextMaintenance: '2024-02-16' },
        { id: '4', name: 'Microscope', status: 'operational', lastMaintenance: '2024-01-25', nextMaintenance: '2024-02-25' },
    ];

    const pendingTests = labTests.filter(test => test.status === 'pending');
    const inProgressTests = labTests.filter(test => test.status === 'inprogress');
    const completedTests = labTests.filter(test => test.status === 'completed');

    const handleStartTest = (testId: string) => {
        console.log('Start test:', testId);
        // API call to start test
    };

    const handleCompleteTest = (testId: string) => {
        console.log('Complete test:', testId);
        // API call to complete test
    };

    const handleViewResults = (testId: string) => {
        console.log('View test results:', testId);
        // Navigate to test results page
    };

    const handleEquipmentMaintenance = (equipmentId: string) => {
        console.log('Schedule maintenance for:', equipmentId);
        // API call to schedule maintenance
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'urgent': return 'red';
            case 'high': return 'yellow';
            case 'normal': return 'green';
            default: return 'blue';
        }
    };

    return (
        <div className="lab-technician-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Good morning, {user?.firstName}!</h1>
                        <p className="welcome-subtitle">Laboratory tests and equipment management</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="lab-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5,2H7V13H9V7H15V13H17V2H19V13A2,2 0 0,1 17,15H15V22H9V15H7A2,2 0 0,1 5,13V2M11,18H13V20H11V18Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid lab-grid">
                <DashboardCard
                    title="Pending Tests"
                    value={pendingTests.length}
                    description="Awaiting processing"
                    color="yellow"
                    onClick={() => setActiveTab('pending')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="In Progress"
                    value={inProgressTests.length}
                    description="Currently processing"
                    color="blue"
                    onClick={() => setActiveTab('inprogress')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Completed Today"
                    value={completedTests.length}
                    description="Tests finished"
                    color="green"
                    onClick={() => setActiveTab('completed')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Equipment Status"
                    value={equipment.filter(eq => eq.status === 'operational').length}
                    description={`of ${equipment.length} operational`}
                    color="purple"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h4a1 1 0 010 2H6.414l2.293 2.293a1 1 0 01.293.707V12a1 1 0 102 0V8a3 3 0 10-3-3v2.586l-2.293-2.293A1 1 0 015 5H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                />
            </div>

            {/* Navigation Tabs */}
            <div className="tabs-container">
                <div className="tabs-header">
                    <button
                        className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
                        onClick={() => setActiveTab('pending')}
                    >
                        Pending Tests ({pendingTests.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'inprogress' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inprogress')}
                    >
                        In Progress ({inProgressTests.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
                        onClick={() => setActiveTab('completed')}
                    >
                        Completed Today ({completedTests.length})
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="lab-content">
                {activeTab === 'pending' && (
                    <div className="tests-content">
                        <div className="section-header">
                            <h3 className="section-title">Pending Laboratory Tests</h3>
                            <p className="section-subtitle">Tests waiting to be processed</p>
                        </div>
                        <div className="tests-list">
                            {pendingTests.map((test) => (
                                <div key={test.id} className="test-card pending">
                                    <div className="test-info">
                                        <div className={`test-priority ${test.priority}`}>
                                            {test.priority === 'urgent' && (
                                                <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '16px', height: '16px' }}>
                                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="test-details">
                                            <h4 className="test-type">{test.testType}</h4>
                                            <p className="test-patient">Patient: {test.patient}</p>
                                            <p className="test-doctor">Ordered by: {test.doctor}</p>
                                            <p className="test-time">Estimated time: {test.estimatedTime}</p>
                                        </div>
                                    </div>
                                    <div className="test-actions">
                                        <span className={`priority-badge ${test.priority}`}>
                                            {test.priority.charAt(0).toUpperCase() + test.priority.slice(1)}
                                        </span>
                                        <button 
                                            className="start-test-btn"
                                            onClick={() => handleStartTest(test.id)}
                                        >
                                            Start Test
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'inprogress' && (
                    <div className="tests-content">
                        <div className="section-header">
                            <h3 className="section-title">Tests in Progress</h3>
                            <p className="section-subtitle">Currently processing laboratory tests</p>
                        </div>
                        <div className="tests-list">
                            {inProgressTests.map((test) => (
                                <div key={test.id} className="test-card inprogress">
                                    <div className="test-info">
                                        <div className="test-status">
                                            <svg className="progress-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="test-details">
                                            <h4 className="test-type">{test.testType}</h4>
                                            <p className="test-patient">Patient: {test.patient}</p>
                                            <p className="test-doctor">Ordered by: {test.doctor}</p>
                                            <p className="test-time">Estimated completion: {test.estimatedTime}</p>
                                        </div>
                                    </div>
                                    <div className="test-actions">
                                        <span className="status-badge inprogress">
                                            In Progress
                                        </span>
                                        <button 
                                            className="complete-test-btn"
                                            onClick={() => handleCompleteTest(test.id)}
                                        >
                                            Mark Complete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'completed' && (
                    <div className="tests-content">
                        <div className="section-header">
                            <h3 className="section-title">Completed Tests</h3>
                            <p className="section-subtitle">Tests completed today</p>
                        </div>
                        <div className="tests-list">
                            {completedTests.map((test) => (
                                <div key={test.id} className="test-card completed">
                                    <div className="test-info">
                                        <div className="test-status">
                                            <svg className="completed-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="test-details">
                                            <h4 className="test-type">{test.testType}</h4>
                                            <p className="test-patient">Patient: {test.patient}</p>
                                            <p className="test-doctor">Ordered by: {test.doctor}</p>
                                            <p className="test-time">Completed in: {test.completedTime}</p>
                                        </div>
                                    </div>
                                    <div className="test-actions">
                                        <span className="status-badge completed">
                                            ✓ Completed
                                        </span>
                                        <button 
                                            className="view-results-btn"
                                            onClick={() => handleViewResults(test.id)}
                                        >
                                            View Results
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Equipment Status Section */}
            <div className="equipment-section">
                <div className="section-header">
                    <h3 className="section-title">Laboratory Equipment Status</h3>
                    <p className="section-subtitle">Current status of laboratory equipment</p>
                </div>
                <div className="equipment-grid">
                    {equipment.map((item) => (
                        <div key={item.id} className={`equipment-card ${item.status}`}>
                            <div className="equipment-info">
                                <h4 className="equipment-name">{item.name}</h4>
                                <p className="equipment-last-maintenance">
                                    Last maintenance: {new Date(item.lastMaintenance).toLocaleDateString()}
                                </p>
                                <p className="equipment-next-maintenance">
                                    Next maintenance: {new Date(item.nextMaintenance).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="equipment-actions">
                                <span className={`status-badge ${item.status}`}>
                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                </span>
                                {item.status === 'operational' && (
                                    <button 
                                        className="maintenance-btn"
                                        onClick={() => handleEquipmentMaintenance(item.id)}
                                    >
                                        Schedule Maintenance
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LabTechnicianDashboard;