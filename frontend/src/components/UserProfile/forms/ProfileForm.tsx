import React from 'react';

interface ProfileFormProps {
  profileData: any;
  isEditing: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ profileData, isEditing, onChange }) => {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label className="form-label">First Name</label>
        <input
          type="text"
          name="firstName"
          value={profileData.firstName}
          onChange={onChange}
          disabled={!isEditing}
          className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={profileData.lastName}
          onChange={onChange}
          disabled={!isEditing}
          className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Email</label>
        <input
          type="email"
          name="email"
          value={profileData.email}
          onChange={onChange}
          disabled={true} // Email should not be editable
          className="form-input readonly"
          title="Email cannot be changed"
        />
      </div>
      <div className="form-group">
        <label className="form-label">Phone Number</label>
        <input
          type="tel"
          name="phoneNumber"
          value={profileData.phoneNumber}
          onChange={onChange}
          disabled={!isEditing}
          className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
          placeholder={isEditing ? 'Enter phone number' : 'Not provided'}
        />
      </div>
      <div className="form-group">
        <label className="form-label">Gender</label>
        <select
          name="gender"
          value={profileData.gender}
          onChange={onChange}
          disabled={!isEditing}
          className={`form-select ${isEditing ? 'editable' : 'readonly'}`}
        >
          <option value="">Select Gender</option>
          <option value="M">Male</option>
          <option value="F">Female</option>
        </select>
      </div>
      <div className="form-group">
        <label className="form-label">Date of Birth</label>
        <input
          type="date"
          name="dateOfBirth"
          value={profileData.dateOfBirth}
          onChange={onChange}
          disabled={!isEditing}
          className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
        />
      </div>
    </div>
  );
};

export default ProfileForm;