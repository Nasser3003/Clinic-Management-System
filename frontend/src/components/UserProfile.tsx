import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/UserProfile.css';

function UserProfile() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [profileData, setProfileData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        phoneNumber: '',
        gender: '',
        dob: '',
        address: '',
        city: '',
        zipCode: '',
        emergencyContact: '',
        emergencyPhone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

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
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
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

        setIsSaving(true);
        setMessage({ type: '', text: '' });

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setMessage({ type: 'success', text: 'Password changed successfully!' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to change password. Please try again.' });
        } finally {
            setIsSaving(false);
        }
    };

    const tabs = [
        { id: 'profile', label: 'Profile Information', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'preferences', label: 'Preferences', icon: '⚙️' },
        { id: 'medical', label: 'Medical Information', icon: '🏥' }
    ];

    return (
        <Layout>
            <div className="user-profile-page">
                {/* Header */}
                <div className="profile-header">
                    <div className="header-content">
                        <div className="avatar-large">
                            <svg className="avatar-icon-large" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                        </div>
                        <div className="header-info">
                            <h1 className="profile-name">
                                {user?.firstName} {user?.lastName}
                            </h1>
                            <p className="profile-role">{user?.role?.toLowerCase()} Account</p>
                            <p className="profile-email">{user?.email}</p>
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
                                            disabled={!isEditing}
                                            className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
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
                                            <option value="MALE">Male</option>
                                            <option value="FEMALE">Female</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label className="form-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            name="dob"
                                            value={profileData.dob}
                                            onChange={handleProfileChange}
                                            disabled={!isEditing}
                                            className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                        />
                                    </div>
                                </div>

                                <div className="address-section">
                                    <h3 className="section-title">Address Information</h3>
                                    <div className="form-grid">
                                        <div className="form-group full-width">
                                            <label className="form-label">Address</label>
                                            <input
                                                type="text"
                                                name="address"
                                                value={profileData.address}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={profileData.city}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">ZIP Code</label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={profileData.zipCode}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="emergency-section">
                                    <h3 className="section-title">Emergency Contact</h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label className="form-label">Emergency Contact Name</label>
                                            <input
                                                type="text"
                                                name="emergencyContact"
                                                value={profileData.emergencyContact}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Emergency Contact Phone</label>
                                            <input
                                                type="tel"
                                                name="emergencyPhone"
                                                value={profileData.emergencyPhone}
                                                onChange={handleProfileChange}
                                                disabled={!isEditing}
                                                className={`form-input ${isEditing ? 'editable' : 'readonly'}`}
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