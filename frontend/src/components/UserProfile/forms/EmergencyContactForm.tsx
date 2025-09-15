import React from 'react';

interface EmergencyContactFormProps {
  profileData: any;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EmergencyContactForm: React.FC<EmergencyContactFormProps> = ({
  profileData,
  isEditing,
  onChange
}) => {
  return (
    <div className="emergency-section">
      <h3 className="section-title">Emergency Contact</h3>
      <div className="form-grid">
        <div className="form-group">
          <label className="form-label">Emergency Contact Name</label>
          <input
            type="text"
            name="emergencyContactName"
            value={profileData.emergencyContactName}
            onChange={onChange}
            disabled={!isEditing}
            className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
            placeholder={isEditing ? 'Enter contact name' : 'Not provided'}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Emergency Contact Phone</label>
          <input
            type="tel"
            name="emergencyContactNumber"
            value={profileData.emergencyContactNumber}
            onChange={onChange}
            disabled={!isEditing}
            className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
            placeholder={isEditing ? 'Enter contact phone' : 'Not provided'}
          />
        </div>
      </div>
    </div>
  );
};

export default EmergencyContactForm;