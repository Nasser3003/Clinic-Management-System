import React, { useState } from 'react';
import '../css/dashboard/SystemAdministration.css';

interface SystemAdministrationProps {
    onNavigate?: (section: string) => void;
}

function SystemAdministrationTab({ onNavigate }: SystemAdministrationProps) {
    const [systemStats] = useState({
        databaseStatus: 'Healthy',
        apiResponseTime: '124ms',
        activeSessions: 47,
        storageUsed: 68,
        lastBackup: '2 hours ago',
        securityAlerts: 2
    });

    const handleAdminAction = (action: string) => {
        console.log('Admin action:', action);
        if (onNavigate) onNavigate(action);
    };

    const adminCards = [
        {
            id: 'permissions',
            title: 'User Permissions',
            description: 'Manage user permissions and access control',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                </svg>
            ),
            action: 'Manage Permissions'
        },
        {
            id: 'configuration',
            title: 'System Configuration',
            description: 'Configure system settings and preferences',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                </svg>
            ),
            action: 'System Settings'
        },
        {
            id: 'audit',
            title: 'Audit Logs',
            description: 'View system activity and user action logs',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a2 2 0 00-2 2v6a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H14a2 2 0 002-2V6a2 2 0 00-2-2V3a2 2 0 012-2h1a1 1 0 100-2h-1a4 4 0 00-4 4v1H6V3a4 4 0 00-4 4v8a4 4 0 004 4h8a4 4 0 004-4V6a2 2 0 00-2-2V3a2 2 0 012-2z" clipRule="evenodd" />
                </svg>
            ),
            action: 'View Logs'
        },
        {
            id: 'backup',
            title: 'Backup & Recovery',
            description: 'Manage system backups and data recovery',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8a2 2 0 012-2v9a2 2 0 002 2h8a2 2 0 002-2V6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V8z" clipRule="evenodd" />
                </svg>
            ),
            action: 'Backup Settings'
        },
        {
            id: 'security',
            title: 'Security Settings',
            description: 'Configure security policies and access controls',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
            ),
            action: 'Security Config'
        },
        {
            id: 'health',
            title: 'System Health',
            description: 'Monitor system performance and health metrics',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                </svg>
            ),
            action: 'Health Dashboard'
        },
        {
            id: 'database',
            title: 'Database Management',
            description: 'Database maintenance and optimization tools',
            icon: (
                <svg className="admin-card-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
            ),
            action: 'Database Tools'
        }
    ];

    return (
        <div className="system-administration">
            <div className="section-header">
                <h3 className="section-title">System Administration</h3>
            </div>

            <div className="system-admin-grid">
                {adminCards.map((card) => (
                    <div
                        key={card.id}
                        className="admin-card clickable-card"
                        onClick={() => handleAdminAction(card.id)}
                    >
                        <div className="admin-card-header">
                            <h4 className="admin-card-title">{card.title}</h4>
                            {card.icon}
                        </div>
                        <p className="admin-card-description">{card.description}</p>
                    </div>
                ))}
            </div>

            <div className="system-status-section">
                <div className="status-header">
                    <h4 className="status-title">System Status</h4>
                    <div className="status-refresh">
                        <button
                            className="refresh-btn"
                            onClick={() => console.log('Refresh status')}
                        >
                            <svg className="refresh-icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="status-grid">
                    <div className="status-item">
                        <div className="status-content">
                            <span className="status-label">Database Status</span>
                            <span className={`status-value ${systemStats.databaseStatus.toLowerCase()}`}>
                {systemStats.databaseStatus}
              </span>
                        </div>
                        <div className="status-indicator healthy"></div>
                    </div>

                    <div className="status-item">
                        <div className="status-content">
                            <span className="status-label">API Response Time</span>
                            <span className="status-value">{systemStats.apiResponseTime}</span>
                        </div>
                        <div className="status-indicator healthy"></div>
                    </div>

                    <div className="status-item">
                        <div className="status-content">
                            <span className="status-label">Active Sessions</span>
                            <span className="status-value">{systemStats.activeSessions}</span>
                        </div>
                        <div className="status-indicator healthy"></div>
                    </div>

                    <div className="status-item">
                        <div className="status-content">
                            <span className="status-label">Storage Used</span>
                            <span className="status-value">{systemStats.storageUsed}%</span>
                        </div>
                        <div className={`status-indicator ${systemStats.storageUsed > 80 ? 'warning' : 'healthy'}`}></div>
                    </div>

                    <div className="status-item">
                        <div className="status-content">
                            <span className="status-label">Last Backup</span>
                            <span className="status-value">{systemStats.lastBackup}</span>
                        </div>
                        <div className="status-indicator healthy"></div>
                    </div>

                    <div className="status-item">
                        <div className="status-content">
                            <span className="status-label">Security Alerts</span>
                            <span className={`status-value ${systemStats.securityAlerts > 0 ? 'warning' : 'healthy'}`}>
                {systemStats.securityAlerts > 0 ? `${systemStats.securityAlerts} pending` : 'None'}
              </span>
                        </div>
                        <div className={`status-indicator ${systemStats.securityAlerts > 0 ? 'warning' : 'healthy'}`}></div>
                    </div>
                </div>
            </div>

            <div className="quick-actions-section">
                <div className="quick-actions-header">
                    <h4 className="quick-actions-title">Quick Actions</h4>
                </div>

                <div className="quick-actions-grid">
                    <button
                        className="quick-action-btn emergency"
                        onClick={() => handleAdminAction('emergency-maintenance')}
                    >
                        <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        Emergency Maintenance
                    </button>

                    <button
                        className="quick-action-btn backup"
                        onClick={() => handleAdminAction('backup-now')}
                    >
                        <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                        Create Backup Now
                    </button>

                    <button
                        className="quick-action-btn security"
                        onClick={() => handleAdminAction('security-scan')}
                    >
                        <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Run Security Scan
                    </button>

                    <button
                        className="quick-action-btn performance"
                        onClick={() => handleAdminAction('performance-check')}
                    >
                        <svg className="action-icon" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                        </svg>
                        Performance Check
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SystemAdministrationTab;