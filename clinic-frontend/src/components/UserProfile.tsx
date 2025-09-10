import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Profile form state
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

  // Password change state
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
      // Simulate API call
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
      // Simulate API call
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
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white mb-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {user?.firstName} {user?.lastName}
              </h1>
              <p className="text-blue-100 capitalize">{user?.role?.toLowerCase()} Account</p>
              <p className="text-blue-100">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-md ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-700 border border-green-200' 
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={profileData.phoneNumber}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender</label>
                    <select
                      name="gender"
                      value={profileData.gender}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <option value="">Select Gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleProfileChange}
                      disabled={!isEditing}
                      className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                        isEditing 
                          ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        name="address"
                        value={profileData.address}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        name="city"
                        value={profileData.city}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={profileData.zipCode}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact Name</label>
                      <input
                        type="text"
                        name="emergencyContact"
                        value={profileData.emergencyContact}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Emergency Contact Phone</label>
                      <input
                        type="tel"
                        name="emergencyPhone"
                        value={profileData.emergencyPhone}
                        onChange={handleProfileChange}
                        disabled={!isEditing}
                        className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm ${
                          isEditing 
                            ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Security Settings</h2>
                
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? 'Changing Password...' : 'Change Password'}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                      <p className="text-sm text-gray-500">Receive appointment reminders via email</p>
                    </div>
                    <button className="bg-blue-600 relative inline-flex h-6 w-11 items-center rounded-full">
                      <span className="translate-x-6 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">SMS Notifications</h3>
                      <p className="text-sm text-gray-500">Receive appointment reminders via SMS</p>
                    </div>
                    <button className="bg-gray-200 relative inline-flex h-6 w-11 items-center rounded-full">
                      <span className="translate-x-1 inline-block h-4 w-4 transform rounded-full bg-white transition"></span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'medical' && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900">Medical Information</h2>
                <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                  <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">
                        Medical Information Required
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>Please contact our office to update your medical information including allergies, medications, and medical history.</p>
                      </div>
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
};

export default UserProfile;