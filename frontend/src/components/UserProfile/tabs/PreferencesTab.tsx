import React from 'react';

const PreferencesTab: React.FC = () => {
  return (
    <div className="preferences-tab">
      <h2 className="tab-title">Preferences</h2>
      <div className="preferences-list">
        <div className="preference-item">
          <div className="preference-info">
            <h3 className="preference-title">Email Notifications</h3>
            <p className="preference-description">Receive appointment reminders via email</p>
          </div>
          <button className="toggle-button enabled">
            <span className="toggle-slider"></span>
          </button>
        </div>
        <div className="preference-item">
          <div className="preference-info">
            <h3 className="preference-title">SMS Notifications</h3>
            <p className="preference-description">Receive appointment reminders via SMS</p>
          </div>
          <button className="toggle-button disabled">
            <span className="toggle-slider"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;