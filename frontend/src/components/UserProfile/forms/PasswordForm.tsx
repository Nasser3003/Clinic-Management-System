import React from 'react';
import LoadingButton from '../../common/LoadingButton';

interface PasswordFormProps {
    passwordData: any;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    isSaving: boolean;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
                                                       passwordData,
                                                       onChange,
                                                       onSubmit,
                                                       isSaving
                                                   }) => {
    const handleSubmit = () => {
        // Create a synthetic event or call onSubmit with a mock event
        const mockEvent = { preventDefault: () => {} } as React.FormEvent;
        onSubmit(mockEvent);
    };

    return (
        <div className="password-form">
            <div className="form-group">
                <label className="form-label">Current Password</label>
                <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
                    className="form-input editable"
                    required
                />
            </div>
            <LoadingButton
                type="button"
                onClick={handleSubmit}
                isLoading={isSaving}
                className="change-password-button"
                loadingText="Changing Password..."
            >
                Change Password
            </LoadingButton>
        </div>
    );
};

export default PasswordForm;