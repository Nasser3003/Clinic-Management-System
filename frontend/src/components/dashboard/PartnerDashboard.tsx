import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardCard from './shared/DashboardCard';
import '../css/Dashboard.css';

function PartnerDashboard() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'reports'>('overview');

    // Mock data - replace with API calls
    const partnerStats = {
        totalReferrals: 45,
        activePatients: 23,
        monthlyRevenue: 12500,
        completedCases: 18,
        pendingApprovals: 3,
    };

    const recentReferrals = [
        { id: '1', patient: 'John Doe', referringDoctor: 'Dr. Smith', date: '2024-02-15', status: 'pending', type: 'Cardiology Consultation' },
        { id: '2', patient: 'Jane Smith', referringDoctor: 'Dr. Johnson', date: '2024-02-14', status: 'approved', type: 'Specialist Review' },
        { id: '3', patient: 'Bob Johnson', referringDoctor: 'Dr. Wilson', date: '2024-02-13', status: 'completed', type: 'Lab Results Review' },
    ];

    const monthlyReports = [
        { month: 'January 2024', referrals: 38, revenue: 11200, completionRate: '95%' },
        { month: 'December 2023', referrals: 42, revenue: 12800, completionRate: '92%' },
        { month: 'November 2023', referrals: 35, revenue: 10500, completionRate: '97%' },
    ];

    const handleApproveReferral = (referralId: string) => {
        console.log('Approve referral:', referralId);
        // API call to approve referral
    };

    const handleRejectReferral = (referralId: string) => {
        console.log('Reject referral:', referralId);
        // API call to reject referral
    };

    const handleViewReferral = (referralId: string) => {
        console.log('View referral details:', referralId);
        // Navigate to referral details page
    };

    const handleDownloadReport = (month: string) => {
        console.log('Download report for:', month);
        // API call to download report
    };

    return (
        <div className="partner-dashboard">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <div className="welcome-text">
                        <h1 className="welcome-title">Partner Dashboard</h1>
                        <p className="welcome-subtitle">Referral management and partnership analytics</p>
                    </div>
                    <div className="welcome-icon">
                        <div className="icon-container">
                            <svg className="partner-icon" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M16,4C16.88,4 17.67,4.38 18.18,5L22,8.82L21.18,9.64L17.36,5.82L15.64,7.54L18.36,10.26L17.54,11.08L14.82,8.36L13.41,9.77L16.13,12.49L15.31,13.31L12.59,10.59L11.18,12L13.9,14.72L13.08,15.54L10.36,12.82L8.64,14.54L11.36,17.26L10.54,18.08L7.82,15.36L5,18.18C4.38,18.67 4,17.88 4,17V5C4,3.89 4.89,3 6,3H16M9,5A2,2 0 0,0 7,7A2,2 0 0,0 9,9A2,2 0 0,0 11,7A2,2 0 0,0 9,5M7,11V13H11V11H7Z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="dashboard-grid partner-grid">
                <DashboardCard
                    title="Total Referrals"
                    value={partnerStats.totalReferrals}
                    description="This month"
                    color="blue"
                    onClick={() => setActiveTab('referrals')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Active Patients"
                    value={partnerStats.activePatients}
                    description="Under care"
                    color="green"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Monthly Revenue"
                    value={`$${(partnerStats.monthlyRevenue / 1000).toFixed(1)}k`}
                    description="Current month"
                    color="purple"
                    onClick={() => setActiveTab('reports')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Completed Cases"
                    value={partnerStats.completedCases}
                    description="This month"
                    color="green"
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    }
                />
                <DashboardCard
                    title="Pending Approvals"
                    value={partnerStats.pendingApprovals}
                    description="Require attention"
                    color="yellow"
                    onClick={() => setActiveTab('referrals')}
                    icon={
                        <svg fill="currentColor" viewBox="0 0 20 20" style={{ width: '20px', height: '20px' }}>
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
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
                        Partnership Overview
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'referrals' ? 'active' : ''}`}
                        onClick={() => setActiveTab('referrals')}
                    >
                        Referral Management ({partnerStats.pendingApprovals})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'reports' ? 'active' : ''}`}
                        onClick={() => setActiveTab('reports')}
                    >
                        Monthly Reports
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="partner-content">
                {activeTab === 'overview' && (
                    <div className="overview-section">
                        <div className="section-header">
                            <h3 className="section-title">Partnership Overview</h3>
                            <p className="section-subtitle">Recent activity and partnership metrics</p>
                        </div>
                        <div className="recent-activity">
                            <h4>Recent Referral Activity</h4>
                            <div className="activity-list">
                                {recentReferrals.map((referral) => (
                                    <div key={referral.id} className="activity-item">
                                        <div className="activity-info">
                                            <p className="activity-title">{referral.type}</p>
                                            <p className="activity-subtitle">
                                                Patient: {referral.patient} | Referred by: {referral.referringDoctor}
                                            </p>
                                        </div>
                                        <div className="activity-meta">
                                            <span className={`status-badge ${referral.status}`}>
                                                {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                                            </span>
                                            <span className="activity-date">
                                                {new Date(referral.date).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'referrals' && (
                    <div className="referrals-section">
                        <div className="section-header">
                            <h3 className="section-title">Referral Management</h3>
                            <p className="section-subtitle">Manage incoming patient referrals</p>
                        </div>
                        <div className="referrals-list">
                            {recentReferrals.map((referral) => (
                                <div key={referral.id} className={`referral-card ${referral.status}`}>
                                    <div className="referral-info">
                                        <div className="referral-details">
                                            <h4 className="referral-type">{referral.type}</h4>
                                            <p className="referral-patient">Patient: {referral.patient}</p>
                                            <p className="referral-doctor">Referring Doctor: {referral.referringDoctor}</p>
                                            <p className="referral-date">
                                                Referred: {new Date(referral.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="referral-actions">
                                        <span className={`status-badge ${referral.status}`}>
                                            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
                                        </span>
                                        {referral.status === 'pending' ? (
                                            <div className="approval-buttons">
                                                <button 
                                                    className="approve-btn"
                                                    onClick={() => handleApproveReferral(referral.id)}
                                                >
                                                    Approve
                                                </button>
                                                <button 
                                                    className="reject-btn"
                                                    onClick={() => handleRejectReferral(referral.id)}
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                className="view-details-btn"
                                                onClick={() => handleViewReferral(referral.id)}
                                            >
                                                View Details
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'reports' && (
                    <div className="reports-section">
                        <div className="section-header">
                            <h3 className="section-title">Monthly Reports</h3>
                            <p className="section-subtitle">Partnership performance and financial reports</p>
                        </div>
                        <div className="reports-list">
                            {monthlyReports.map((report, index) => (
                                <div key={index} className="report-card">
                                    <div className="report-info">
                                        <h4 className="report-month">{report.month}</h4>
                                        <div className="report-stats">
                                            <div className="stat-item">
                                                <span className="stat-label">Referrals:</span>
                                                <span className="stat-value">{report.referrals}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Revenue:</span>
                                                <span className="stat-value">${report.revenue.toLocaleString()}</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-label">Completion Rate:</span>
                                                <span className="stat-value">{report.completionRate}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="report-actions">
                                        <button 
                                            className="download-btn"
                                            onClick={() => handleDownloadReport(report.month)}
                                        >
                                            Download Report
                                        </button>
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

export default PartnerDashboard;