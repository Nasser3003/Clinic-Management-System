import React from 'react';

interface TabNavigationProps {
    activeTab: string;
    onTabChange: (tabId: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
    const tabs = [
        { id: 'profile', label: 'Profile Information', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔐' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'medical', label: 'Medical Information', icon: '🏥' },
        { id: 'visit-notes', label: 'Visit Notes', icon: '📋' },
        { id: 'prescriptions', label: 'Prescriptions', icon: '💊' }
    ];

    return (
        <div className="tab-navigation">
            <nav className="tab-nav">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                    >
                        <span className="tab-icon">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default TabNavigation;