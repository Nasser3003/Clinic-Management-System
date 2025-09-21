import React from 'react';

interface TabNavigationProps {
    activeTab: 'create' | 'all' | 'doctor-calendar' | 'patient-calendar';
    setActiveTab: (tab: 'create' | 'all' | 'doctor-calendar' | 'patient-calendar') => void;
    isAdmin: boolean;
    isEmployee: boolean;
    isDoctor: boolean;
}

function TabNavigation({ activeTab, setActiveTab, isAdmin, isEmployee, isDoctor }: TabNavigationProps) {
    return (
        <div className="tabs-container">
            <div className="tabs-header">
                {(isAdmin || isEmployee || isDoctor) && (
                    <button
                        className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        Create Appointment
                    </button>
                )}
                <button
                    className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Appointments
                </button>
                {(isAdmin || isEmployee || isDoctor) && (
                    <button
                        className={`tab-button ${activeTab === 'doctor-calendar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('doctor-calendar')}
                    >
                        Doctor Calendar
                    </button>
                )}
                {(isAdmin || isEmployee) && (
                    <button
                        className={`tab-button ${activeTab === 'patient-calendar' ? 'active' : ''}`}
                        onClick={() => setActiveTab('patient-calendar')}
                    >
                        Patient Calendar
                    </button>
                )}
            </div>
        </div>
    );
}

export default TabNavigation;