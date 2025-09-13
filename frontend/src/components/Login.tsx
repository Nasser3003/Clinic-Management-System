import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './css/Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await authService.login({ email, password });

            // Debug: Let's see what the backend actually returns
            console.log('Backend response:', response);
            console.log('Response structure:', {
                hasJwt: !!response.jwt,
                hasUser: !!response.user,
                responseKeys: Object.keys(response)
            });

            if (!response.jwt)
                throw new Error('No JWT token received from server');

            if (!response.user)
                throw new Error('No user data received from server');

            // Now the response contains { jwt: string, user: User }
            login(response.jwt, response.user);
            navigate('/dashboard');
        } catch (err: any) {
            console.error('Login error:', err);

            let errorMessage = 'Login failed';

            if (err.response?.data) {
                const data = err.response.data;

                if (typeof data === 'string') {
                    errorMessage = data;
                } else if (data.message) {
                    errorMessage = data.message;
                } else if (data.details && Array.isArray(data.details)) {
                    errorMessage = data.details.join(', ');
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-header">
                    <h2 className="login-title">
                        Sign in to Clinic
                    </h2>
                </div>
                <form className="login-form" onSubmit={handleSubmit}>
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
                        <div className="input-group">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="form-input password-input"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <div className="forgot-password-link" style={{ textAlign: 'right', marginBottom: '16px' }}>
                        <button
                            type="button"
                            onClick={() => navigate('/forgot-password')}
                            className="forgot-password-button"
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#007bff',
                                textDecoration: 'underline',
                                cursor: 'pointer',
                                fontSize: '14px'
                            }}
                        >
                            Forgot your password?
                        </button>
                    </div>

                    <div className="submit-section">
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="signup-link">
            <span className="signup-text">
              Don't have an account?{' '}
                <button
                    type="button"
                    onClick={() => navigate('/register')}
                    className="signup-button"
                >
                Sign up
              </button>
            </span>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;