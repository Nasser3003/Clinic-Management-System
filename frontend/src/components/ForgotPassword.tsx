import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';

function ForgotPassword() {
    const [step, setStep] = useState('email'); // 'email' or 'reset'
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.forgotPassword({ email });
            setSuccessMessage('OTP sent to your email successfully!');
            setStep('reset');
        } catch (err) {
            console.error('Forgot password error:', err);
            setError(err.response?.data || err.message || 'Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authService.resetPassword({
                email,
                otp,
                newPassword,
                confirmNewPassword
            });
            setSuccessMessage('Password reset successfully!');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error('Reset password error:', err);
            setError(err.response?.data || err.message || 'Failed to reset password');
        } finally {
            setLoading(false);
        }
    };

    const handleBackToEmail = () => {
        setStep('email');
        setOtp('');
        setNewPassword('');
        setConfirmNewPassword('');
        setError('');
        setSuccessMessage('');
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h2 className="login-title">
                        {step === 'email' ? 'Forgot Password' : 'Reset Password'}
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {step === 'email' 
                            ? 'Enter your email to receive a reset code'
                            : 'Enter the code sent to your email and your new password'
                        }
                    </p>
                </div>

                {step === 'email' ? (
                    <form className="login-form" onSubmit={handleSendOTP}>
                        <div className="form-inputs">
                            <div className="input-group">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="form-input email-input"
                                    placeholder="Email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        {successMessage && (
                            <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#166534',
                                padding: '12px 16px',
                                borderRadius: '6px',
                                marginBottom: '16px'
                            }}>
                                {successMessage}
                            </div>
                        )}

                        <div className="submit-section">
                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-button"
                            >
                                {loading ? 'Sending...' : 'Send Reset Code'}
                            </button>
                        </div>

                        <div className="signup-link">
                            <span className="signup-text">
                                Remember your password?{' '}
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="signup-button"
                                >
                                    Back to Login
                                </button>
                            </span>
                        </div>
                    </form>
                ) : (
                    <form className="login-form" onSubmit={handleResetPassword}>
                        <div className="form-inputs">
                            <div className="input-group">
                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    required
                                    maxLength={6}
                                    className="form-input"
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    required
                                    className="form-input password-input"
                                    placeholder="New password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                            </div>
                            <div className="input-group">
                                <input
                                    id="confirmNewPassword"
                                    name="confirmNewPassword"
                                    type="password"
                                    required
                                    className="form-input password-input"
                                    placeholder="Confirm new password"
                                    value={confirmNewPassword}
                                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="error-message">{error}</div>
                        )}

                        {successMessage && (
                            <div style={{
                                backgroundColor: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                color: '#166534',
                                padding: '12px 16px',
                                borderRadius: '6px',
                                marginBottom: '16px'
                            }}>
                                {successMessage}
                            </div>
                        )}

                        <div className="submit-section">
                            <button
                                type="submit"
                                disabled={loading}
                                className="submit-button"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </div>

                        <div className="signup-link">
                            <span className="signup-text">
                                Didn't receive the code?{' '}
                                <button
                                    type="button"
                                    onClick={handleBackToEmail}
                                    className="signup-button"
                                >
                                    Resend
                                </button>
                            </span>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPassword;