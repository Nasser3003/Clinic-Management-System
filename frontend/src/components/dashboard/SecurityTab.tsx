import React, { useState, useEffect } from 'react';
import '../css/securityTab.css';



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
    const [showOTPField, setShowOTPField] = useState(false);
    const [otpCode, setOtpCode] = useState('');
    const [countdown, setCountdown] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0)
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleToggle2FA = () => {
        if (!twoFAEnabled) {
            // Show OTP field and start countdown
            setShowOTPField(true);
            setCountdown(60);
            // Here you would call your API to send OTP to email
            console.log('Sending OTP to email...');
        } else {
            // Disable 2FA
            setTwoFAEnabled(false);
            setShowOTPField(false);
            setOtpCode('');
            setCountdown(0);
        }
    };

    const handleResendOTP = () => {
        setCountdown(60);
        setOtpCode('');
        // Here you would call your API to resend OTP
        console.log('Resending OTP to email...');
    };

    const handleVerifyOTP = async () => {
        if (otpCode.length !== 6) return;

        setIsVerifying(true);
        try {
            // Here you would call your API to verify OTP
            console.log('Verifying OTP:', otpCode);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // If successful
            setTwoFAEnabled(true);
            setShowOTPField(false);
            setOtpCode('');
            setCountdown(0);
        } catch (error) {
            console.error('OTP verification failed');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleCancelOTP = () => {
        setShowOTPField(false);
        setOtpCode('');
        setCountdown(0);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onChangePassword(e);
    };

    return (
        <div className="security-tab">
            <h2 className="tab-title">Security Settings</h2>

            <div className="security-content">
                <div className="password-section">
                    <h3 className="section-title">Change Password</h3>
                    <div className="password-form">
                        <div className="form-group">
                            <label htmlFor="currentPassword" className="form-label">Current Password</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                value={passwordData.currentPassword || ''}
                                onChange={onPasswordChange}
                                className="form-input"
                                placeholder="Enter your current password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">New Password</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                value={passwordData.newPassword || ''}
                                onChange={onPasswordChange}
                                className="form-input"
                                placeholder="Enter your new password"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={passwordData.confirmPassword || ''}
                                onChange={onPasswordChange}
                                className="form-input"
                                placeholder="Confirm your new password"
                                required
                            />
                        </div>
                        <button
                            type="button"
                            className="submit-button"
                            disabled={isSaving}
                            onClick={handleSubmit}
                        >
                            {isSaving ? 'Updating...' : 'Update Password'}
                        </button>
                    </div>
                </div>

                <div className="vertical-separator" />

                <div className="twofa-section">
                    <div className="preference-item">
                        <div className="preference-info">
                            <h3 className="preference-title">Two-Factor Authentication</h3>
                            <p className="preference-description">
                                Add an extra layer of security by requiring a verification code when signing in
                            </p>
                        </div>
                        <button
                            className={`toggle-button ${twoFAEnabled ? 'enabled' : 'disabled'}`}
                            onClick={handleToggle2FA}
                            aria-label="Toggle 2FA"
                            disabled={showOTPField}
                        >
                            <span className={`toggle-slider ${twoFAEnabled ? 'active' : 'inactive'}`}></span>
                        </button>
                    </div>

                    {showOTPField && (
                        <div className="otp-verification-section">
                            <div className="otp-container">
                                <h4 className="otp-title">Verify Your Email</h4>
                                <p className="otp-description">
                                    We've sent a 6-digit verification code to your email address.
                                </p>

                                <div className="otp-input-group">
                                    <label htmlFor="otpCode" className="form-label">Verification Code</label>
                                    <input
                                        type="text"
                                        id="otpCode"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                        className="otp-input"
                                        placeholder="000000"
                                        maxLength={6}
                                    />
                                </div>

                                <div className="otp-actions">
                                    <button
                                        className="verify-button"
                                        onClick={handleVerifyOTP}
                                        disabled={otpCode.length !== 6 || isVerifying}
                                    >
                                        {isVerifying ? 'Verifying...' : 'Verify & Enable 2FA'}
                                    </button>

                                    <button
                                        className="resend-button"
                                        onClick={handleResendOTP}
                                        disabled={countdown > 0}
                                    >
                                        {countdown > 0 ? `Resend in ${countdown}s` : 'Resend Code'}
                                    </button>

                                    <button
                                        className="cancel-button"
                                        onClick={handleCancelOTP}
                                    >
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