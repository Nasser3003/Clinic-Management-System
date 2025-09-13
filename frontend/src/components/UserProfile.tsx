import React, {useEffect, useRef, useState} from 'react';
import {useAuth} from '../context/AuthContext';
import Layout from './Layout';
import './css/UserProfile.css';
import api from '../services/api'; // Assuming you have an api service

function UserProfile() {
    const { user, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Avatar upload states
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState(false);
    const [avatarKey, setAvatarKey] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initialize with actual user data from JWT/login
    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: user?.phoneNumber || '',
        gender: user?.gender || '',
        dateOfBirth: user?.dateOfBirth || '',
        emergencyContactName: user?.emergencyContactName || '',
        emergencyContactNumber: user?.emergencyContactNumber || ''
    });

    // Update profileData when a user changes
    useEffect(() => {
        if (user) {
            setProfileData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phoneNumber: user.phoneNumber || '',
                gender: user.gender || '',
                dateOfBirth: user.dateOfBirth || '',
                emergencyContactName: user.emergencyContactName || '',
                emergencyContactNumber: user.emergencyContactNumber || ''
            });
        }
    }, [user]);

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Avatar upload handlers
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or WebP)' });
            return;
        }

        // Validate file size (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setMessage({ type: 'error', text: 'File size must be less than 5MB' });
            return;
        }

        await uploadAvatar(file);
    };

    const uploadAvatar = async (file: File) => {
        setIsUploadingAvatar(true);
        setMessage({ type: '', text: '' });

        try {
            const formData = new FormData();
            formData.append('email', user?.email || '');
            formData.append('file', file);

            // Remove the Content-Type header - let axios handle it automatically
            await api.post('/files/upload-avatar', formData);

            // Success - force avatar reloads
            setAvatarKey(prev => prev + 1);
            setAvatarError(false);
            setMessage({ type: 'success', text: 'Profile picture updated successfully!' });

        } catch (error: any) {
            console.error('Avatar upload error:', error);

            let errorMessage = 'Failed to upload profile picture. Please try again.';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setMessage({
                type: 'error',
                text: errorMessage
            });
        } finally {
            setIsUploadingAvatar(false);
        }
    };
    const handleAvatarError = () => {
        setAvatarError(true);
    };

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Prepare data for backend - map frontend fields to backend fields
            const updateData = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phoneNumber,
                gender: profileData.gender,
                dateOfBirth: profileData.dateOfBirth,
                emergencyContactName: profileData.emergencyContactName,
                emergencyContactNumber: profileData.emergencyContactNumber
            };
            await api.put(`/user/update-profile/${user?.email}`, updateData);
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);

            // Update user context with new data
            if (updateUser && user) {
                updateUser({
                    ...user,
                    firstName: profileData.firstName,
                    lastName: profileData.lastName,
                    phoneNumber: profileData.phoneNumber,
                    gender: profileData.gender as 'M' | 'F',
                    dateOfBirth: profileData.dateOfBirth,
                    emergencyContactName: profileData.emergencyContactName,
                    emergencyContactNumber: profileData.emergencyContactNumber
                });
            }

        } catch (error: any) {
            console.error('Error updating profile:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
            return;
        }

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await api.put('/user/change-password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            });

            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            console.error('Error changing password:', error);
            setMessage({
                type: 'error',
                text: error.response?.data || 'Failed to change password. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return dateString;
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Information', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'medical', label: 'Medical Information', icon: '🏥' }
    ];

    const avatarUrl = avatarError
        ? '/default-avatar.png'
        : `/api/files/avatar/${user?.email}?v=${avatarKey}`;

    return (
        <Layout>
            <div className="user-profile-page">
                {/* Header */}
                <div className="profile-header">
                    <div className="header-content">
                        <div
                            className={`avatar-large clickable`}
                            onClick={handleAvatarClick}
                            style={{
                                backgroundImage: !avatarError ? `url(${avatarUrl})` : undefined
                            }}
                        >
                            {/* Default avatar icon - only show if no background image */}
                            {avatarError && (
                                <svg className="avatar-icon-large" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            )}

                            {/* Hover overlay */}
                            <div className="avatar-overlay">
                                {isUploadingAvatar ? (
                                    <div className="avatar-upload-content">
                                        <div className="upload-spinner"></div>
                                        <span className="upload-spinner-text">Uploading...</span>
                                    </div>
                                ) : (
                                    <div className="avatar-upload-content">
                                        <svg className="avatar-upload-icon" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h8v1a1 1 0 102 0V3a2 2 0 012 2v6h-2V5H6v6H4V5z"/>
                                            <path d="M6 13a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm8-1a1 1 0 00-1 1v.01a1 1 0 002 0V13a1 1 0 00-1-1z"/>
                                        </svg>
                                        <div className="avatar-upload-text">Change Photo</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleFileSelect}
                            className="hidden-file-input"
                            disabled={isUploadingAvatar}
                        />

                        <div className="header-info">
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

                {/* Message */}
                {message.text && (
                    <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
                        {message.text}
                    </div>
                )}

                <div className="profile-content">
                    {/* Tab Navigation */}
                    <div className="tab-navigation">
                        <nav className="tab-nav">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <span className="tab-icon">{tab.icon}</span>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {activeTab === 'profile' && (
                            <div className="profile-tab">
                                <div className="tab-header">
                                    <h2 className="tab-title">Profile Information</h2>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className="edit-button"
                                    >
                                        {isEditing ? 'Cancel' : 'Edit Profile'}
                                    </button>
                                </div>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label className="form-label">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={profileData.firstName}
                                            onChange={handleProfileChange}
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
                                            onChange={handleProfileChange}
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
                                            onChange={handleProfileChange}
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
                                            onChange={handleProfileChange}
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
                                            onChange={handleProfileChange}
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
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                        />
                                    </div>
                                </div>

                                <div className="emergency-section">
                                    <h3 className="section-title">Emergency Contact</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Emergency Contact Name</label>
                                            <input
                                                type="text"
                                                name="emergencyContactName"
                                                value={profileData.emergencyContactName}
                                                onChange={handleProfileChange}
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
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                                placeholder={isEditing ? 'Enter contact phone' : 'Not provided'}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="cancel-button"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={isSaving}
                                            className="save-button"
                                        >
                                            {isSaving ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="security-tab">
                                <h2 className="tab-title">Security Settings</h2>

                                <form onSubmit={handleChangePassword} className="password-form">
                                    <div className="form-group">
                                        <label className="form-label">Current Password</label>
                                        <input
                                            type="password"
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input editable"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">New Password</label>
                                        <input
                                            type="password"
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input editable"
                                            required
                                            minLength={8}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Confirm New Password</label>
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="form-input editable"
                                            required
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="change-password-button"
                                    >
                                        {isSaving ? 'Changing Password...' : 'Change Password'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
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
                        )}

                        {activeTab === 'medical' && (
                            <div className="medical-tab">
                                <h2 className="tab-title">Medical Information</h2>
                                <div className="medical-notice">
                                    <div className="notice-icon">
                                        <svg className="warning-icon" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="notice-content">
                                        <h3 className="notice-title">
                                            Medical Information Required
                                        </h3>
                                        <div className="notice-text">
                                            <p>Please contact our office to update your medical information including allergies, medications, and medical history.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default UserProfile;