import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import './css/Register.css';
import Layout from "./Layout";

function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        gender: '',
        dob: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            await authService.register(formData);
            navigate('/login', {
                state: { message: 'Registration successful! Please log in.' }
            });
        } catch (err: any) {
            console.error('Registration error:', err);

            let errorMessage = 'Registration failed';

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
        <Layout>
        <div className="register-page">
            <div className="register-container">
                <div className="register-header">
                    <h2 className="register-title">
                        Create your account
                    </h2>
                </div>
                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="form-fields">
                        <div className="name-row">
                            <input
                                name="firstName"
                                type="text"
                                required
                                className="form-input"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <input
                                name="lastName"
                                type="text"
                                required
                                className="form-input"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <input
                            name="email"
                            type="email"
                            required
                            className="form-input"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <input
                            name="phoneNumber"
                            type="tel"
                            required
                            className="form-input"
                            placeholder="Phone number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                        />
                        <select
                            name="gender"
                            required
                            className="form-select"
                            value={formData.gender}
                            onChange={handleChange}
                        >
                            <option value="">Select gender</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                        <input
                            name="dob"
                            type="date"
                            required
                            className="form-input"
                            value={formData.dob}
                            onChange={handleChange}
                        />
                        <input
                            name="password"
                            type="password"
                            required
                            className="form-input"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            className="form-input"
                            placeholder="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    <div className="submit-section">
                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-button"
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </button>
                    </div>

                    <div className="signin-link">
            <span className="signin-text">
              Already have an account?{' '}
                <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="signin-button"
                >
                Sign in
              </button>
            </span>
                    </div>
                </form>
            </div>
        </div>
        </Layout>
    );
}

export default Register;