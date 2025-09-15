import { useState, useRef } from 'react';
import api from '../services/api';

interface UseAvatarProps {
  user: any;
  refreshAvatar: () => void;
  onMessage: (message: { type: string; text: string }) => void;
}

export const useAvatar = ({ user, refreshAvatar, onMessage }: UseAvatarProps) => {
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarClick = () => {
    if (!isUploadingAvatar) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onMessage({ type: 'error', text: 'Please select a valid image file (JPEG, PNG, or WebP)' });
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      onMessage({ type: 'error', text: 'File size must be less than 5MB' });
      return;
    }

    await uploadAvatar(file);
  };

  const uploadAvatar = async (file: File) => {
    setIsUploadingAvatar(true);
    onMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('email', user?.email || '');
      formData.append('file', file);

      console.log('Uploading avatar for:', user?.email);

      const response = await api.post('/files/upload-avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Avatar upload response:', response);

      // Success - force avatar reloads across the entire app
      refreshAvatar();
      setAvatarError(false);
      onMessage({ type: 'success', text: 'Profile picture updated successfully!' });

      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error: any) {
      console.error('Avatar upload error:', error);

      // Better error handling
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

      onMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleAvatarError = () => {
    console.log('Avatar failed to load, setting error state');
    setAvatarError(true);
  };

  const handleAvatarLoad = () => {
    console.log('Avatar loaded successfully');
    setAvatarError(false);
  };

  return {
    isUploadingAvatar,
    avatarError,
    fileInputRef,
    handleAvatarClick,
    handleFileSelect,
    handleAvatarError,
    handleAvatarLoad,
  };
};