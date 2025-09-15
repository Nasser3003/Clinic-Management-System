import { useState } from 'react';
import api from '../services/api';

interface UsePasswordProps {
  onMessage: (message: { type: string; text: string }) => void;
}

export const usePassword = ({ onMessage }: UsePasswordProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      onMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      onMessage({ type: 'error', text: 'Password must be at least 8 characters long.' });
      return;
    }

    setIsSaving(true);
    onMessage({ type: '', text: '' });

    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });

      onMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      console.error('Error changing password:', error);
      onMessage({
        type: 'error',
        text: error.response?.data || 'Failed to change password. Please try again.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  return {
    passwordData,
    isSaving,
    handlePasswordChange,
    handleChangePassword
  };
};