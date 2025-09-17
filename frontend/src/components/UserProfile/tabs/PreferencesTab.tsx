import React, { useState } from 'react';

const PreferencesTab: React.FC = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    const handleEmailToggle = () => {
        setEmailNotifications(!emailNotifications);
    };

    const handleSmsToggle = () => {
        setSmsNotifications(!smsNotifications);
    };

    return (
        <div className="preferences-tab">
            <h2 className="tab-title">Preferences</h2>
            <div className="preferences-list">
                <div className="preference-item">
                    <div className="preference-info">
                        <h3 className="preference-title">Email Notifications</h3>
                        <p className="preference-description">Receive appointment reminders via email</p>
                    </div>
                    <button
                        className={`toggle-button ${emailNotifications ? 'enabled' : 'disabled'}`}
                        onClick={handleEmailToggle}
                        aria-label="Toggle email notifications"
                    >
                        <span className="toggle-slider"></span>
                    </button>
                </div>
                <div className="preference-item">
                    <div className="preference-info">
                        <h3 className="preference-title">SMS Notifications</h3>
                        <p className="preference-description">Receive appointment reminders via SMS</p>
                    </div>
                    <button
                        className={`toggle-button ${smsNotifications ? 'enabled' : 'disabled'}`}
                        onClick={handleSmsToggle}
                        aria-label="Toggle SMS notifications"
                    >
                        <span className="toggle-slider"></span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PreferencesTab;