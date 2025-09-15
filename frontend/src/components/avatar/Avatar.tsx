import React from 'react';
import { useAvatar } from '../../hooks/useAvatar';

interface AvatarProps {
  user: any;
  avatarKey: string;
  refreshAvatar: () => void;
  onMessage: (message: { type: string; text: string }) => void;
}

const Avatar: React.FC<AvatarProps> = ({ user, avatarKey, refreshAvatar, onMessage }) => {
  const {
    isUploadingAvatar,
    avatarError,
    fileInputRef,
    handleAvatarClick,
    handleFileSelect,
    handleAvatarError,
    handleAvatarLoad,
  } = useAvatar({ user, refreshAvatar, onMessage });

  const getAvatarUrl = () => {
    if (!user?.email) return '';
    return `http://localhost:3001/files/avatar/${encodeURIComponent(user.email)}?v=${avatarKey}&t=${Date.now()}`;
  };

  const avatarUrl = getAvatarUrl();

  return (
    <div
      className="avatar-large clickable"
      onClick={handleAvatarClick}
    >
      {/* Avatar Image */}
      {!avatarError && avatarUrl ? (
        <img
          src={avatarUrl}
          alt="Profile"
          className="avatar-image"
          onError={handleAvatarError}
          onLoad={handleAvatarLoad}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: 'inherit'
          }}
        />
      ) : (
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
              <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/>
            </svg>
            <div className="avatar-upload-text">Change Photo</div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden-file-input"
        disabled={isUploadingAvatar}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default Avatar;