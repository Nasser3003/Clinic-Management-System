import React, { useState } from 'react';
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
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [show2faPopup, setShow2faPopup] = useState(false);

    const handleToggle2FA = () => {
        if (!twoFAEnabled) {
            setShow2faPopup(true);
        } else {
            setTwoFAEnabled(false);
        }
    };

    const handlePopupClose = () => {
        setShow2faPopup(false);
    };

    const handleEnable2FA = () => {
        setShow2faPopup(false);
        setTwoFAEnabled(true);
        // Here, trigger your 2FA setup logic, e.g., call API to send email code
    };

    return (
        <div className="security-tab">
            <h2 className="tab-title">Security Settings</h2>

            <div className="security-content">
                <div className="password-section">
                    <PasswordForm
                        passwordData={passwordData}
                        onChange={onPasswordChange}
                        onSubmit={onChangePassword}
                        isSaving={isSaving}
                    />
                </div>
                <div className="vertical-separator" />
                <div className="twofa-section">
                    <h3 className="twofa-title">Two-Factor Authentication</h3>
                    <p className="twofa-description">
                        Add an extra layer of security by requiring a verification code when signing in.
                    </p>
                    <button
                        className={`toggle-button ${twoFAEnabled ? 'enabled' : 'disabled'}`}
                        onClick={handleToggle2FA}
                        aria-label="Toggle 2FA"
                    >
                        <span className="toggle-slider"></span>
                        <span className="toggle-label">
                            {twoFAEnabled ? '2FA Enabled' : 'Enable Two-Factor Authentication'}
                        </span>
                    </button>
                    {/* Modal for 2FA Enable Popup */}
                    {show2faPopup && (
                        <div className="popup-overlay">
                            <div className="popup-modal">
                                <h4>Enable Two-Factor Authentication</h4>
                                <p>
                                    To enable 2FA, we will email you a verification code.
                                </p>
                                <div className="popup-actions">
                                    <button className="btn" onClick={handleEnable2FA}>
                                        OK
                                    </button>
                                    <button className="btn btn-secondary" onClick={handlePopupClose}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SecurityTab;
