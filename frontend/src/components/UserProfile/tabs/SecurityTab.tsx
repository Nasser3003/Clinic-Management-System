import React from 'react';
import PasswordForm from '../forms/PasswordForm';

interface SecurityTabProps {
  passwordData: any;
  isSaving: boolean;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangePassword: (e: React.FormEvent) => void;
}

const SecurityTab: React.FC<SecurityTabProps> = ({
  passwordData,
  isSaving,
  onPasswordChange,
  onChangePassword
}) => {
  return (
    <div className="security-tab">
      <h2 className="tab-title">Security Settings</h2>
      <PasswordForm
        passwordData={passwordData}
        onChange={onPasswordChange}
        onSubmit={onChangePassword}
        isSaving={isSaving}
      />
    </div>
  );
};

export default SecurityTab;