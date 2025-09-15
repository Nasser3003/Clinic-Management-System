import { useState, useEffect } from 'react';
import api from '../services/api';

interface UseProfileProps {
    user: any;
    updateUser: any;
    onMessage: (message: { type: string; text: string }) => void;
}

export const useProfile = ({ user, updateUser, onMessage }: UseProfileProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

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

    // Update profileData when user changes
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

    const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setProfileData({
            ...profileData,
            [e.target.name]: e.target.value
        });
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        onMessage({ type: '', text: '' });

        try {
            // Prepare data for backend - map frontend fields to backend fields
            const updateData = {
                firstName: profileData.firstName,
                lastName: profileData.lastName,
                phone: profileData.phoneNumber, // Backend expects 'phone'
                gender: profileData.gender,
                dateOfBirth: profileData.dateOfBirth,
                emergencyContactName: profileData.emergencyContactName,
                emergencyContactNumber: profileData.emergencyContactNumber
            };
            await api.put(`/user/update-profile/${user?.email}`, updateData);
            onMessage({ type: 'success', text: 'Profile updated successfully!' });
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
            onMessage({
                type: 'error',
                text: error.response?.data?.message || 'Failed to update profile. Please try again.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEdit = () => {
        setIsEditing(!isEditing);
    };

    return {
        profileData,
        isEditing,
        isSaving,
        handleProfileChange,
        handleSaveProfile,
        toggleEdit,
        setProfileData
    };
};