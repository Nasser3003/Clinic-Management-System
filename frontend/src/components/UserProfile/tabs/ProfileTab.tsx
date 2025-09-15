import React from 'react';
import ProfileForm from '../forms/ProfileForm';
import EmergencyContactForm from '../forms/EmergencyContactForm';
import LoadingButton from '../../common/LoadingButton';

interface ProfileTabProps {
  profileData: any;
  isEditing: boolean;
  isSaving: boolean;
  onToggleEdit: () => void;
  onProfileChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSaveProfile: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({
  profileData,
  isEditing,
  isSaving,
  onToggleEdit,
  onProfileChange,
  onSaveProfile
}) => {
  return (
    <div className="profile-tab">
      <div className="tab-header">
        <h2 className="tab-title">Profile Information</h2>
        <button
          onClick={onToggleEdit}
          className="edit-button"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      <ProfileForm
        profileData={profileData}
        isEditing={isEditing}
        onChange={onProfileChange}
      />

      <EmergencyContactForm
        profileData={profileData}
        isEditing={isEditing}
        onChange={onProfileChange}
      />

      {isEditing && (
        <div className="action-buttons">
          <button
            onClick={onToggleEdit}
            className="cancel-button"
          >
            Cancel
          </button>
          <LoadingButton
            onClick={onSaveProfile}
            isLoading={isSaving}
            className="save-button"
            loadingText="Saving..."
          >
            Save Changes
          </LoadingButton>
        </div>
      )}
    </div>
  );
};

export default ProfileTab;