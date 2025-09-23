import React from 'react';
import Avatar from '../avatar/Avatar';

interface ProfileHeaderProps {
    user: any;
    profileData: any;
    avatarKey: string;
    refreshAvatar: () => void;
    onMessage: (message: { type: string; text: string }) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                         user,
                                                         profileData,
                                                         avatarKey,
                                                         refreshAvatar,
                                                         onMessage
                                                     }) => {
    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    return (
        <div className="profile-header">
            <div className="profile-header-content">
                <Avatar
                    user={user}
                    avatarKey={avatarKey}
                    refreshAvatar={refreshAvatar}
                    onMessage={onMessage}
                />

                <div className="profile-header-info">
                    <h1 className="profile-name">
                        {profileData.firstName} {profileData.lastName}
                    </h1>
                    <p className="profile-role">{user?.role?.toLowerCase()} Account</p>
                    <p className="profile-email">{user?.email}</p>
                    {profileData.dateOfBirth && (
                        <p className="profile-dob">Born: {formatDate(profileData.dateOfBirth)}</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;