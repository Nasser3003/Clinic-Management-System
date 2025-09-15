// components/UserProfile.tsx (Refactored)
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/UserProfile.css';

// Import components
import MessageAlert from './common/MessageAlert';
import ProfileHeader from './UserProfile/ProfileHeader';
import TabNavigation from './UserProfile/TabNavigation';
import ProfileTab from './UserProfile/tabs/ProfileTab';
import SecurityTab from './UserProfile/tabs/SecurityTab';
import PreferencesTab from './UserProfile/tabs/PreferencesTab';
import MedicalTab from './UserProfile/tabs/MedicalTab';

// Import hooks
import { useProfile } from '../hooks/useProfile';
import { usePassword } from '../hooks/usePassword';

function UserProfile() {
    const { user, updateUser, avatarKey, refreshAvatar } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [message, setMessage] = useState({ type: '', text: '' });

    // Custom hooks
    const {
        profileData,
        isEditing,
        isSaving: isProfileSaving,
        handleProfileChange,
        handleSaveProfile,
        toggleEdit
    } = useProfile({ user, updateUser, onMessage: setMessage });

    const {
        passwordData,
        isSaving: isPasswordSaving,
        handlePasswordChange,
        handleChangePassword
    } = usePassword({ onMessage: setMessage });

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <ProfileTab
                        profileData={profileData}
                        isEditing={isEditing}
                        isSaving={isProfileSaving}
                        onToggleEdit={toggleEdit}
                        onProfileChange={handleProfileChange}
                        onSaveProfile={handleSaveProfile}
                    />
                );
            case 'security':
                return (
                    <SecurityTab
                        passwordData={passwordData}
                        isSaving={isPasswordSaving}
                        onPasswordChange={handlePasswordChange}
                        onChangePassword={handleChangePassword}
                    />
                );
            case 'preferences':
                return <PreferencesTab />;
            case 'medical':
                return <MedicalTab />;
            default:
                return null;
        }
    };

    return (
        <Layout>
            <div className="user-profile-page">
                <ProfileHeader
                    user={user}
                    profileData={profileData}
                    avatarKey={String(avatarKey)}
                    refreshAvatar={refreshAvatar}
                    onMessage={setMessage}
                />

                <MessageAlert message={message} />

                <div className="profile-content">
                    <TabNavigation
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />

                    <div className="tab-content">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserProfile;