import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Layout.css';

interface LayoutProps {
    children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigationItems = [
        { path: '/appointments/book', label: 'Book Appointment', roles: ['PATIENT'] },
        { path: '/about', label: 'About Us', roles: ['ADMIN', 'EMPLOYEE', 'PATIENT'] },
        { path: '/contact', label: 'Contact', roles: ['ADMIN', 'EMPLOYEE', 'PATIENT'] },
    ];

    const visibleNavItems = navigationItems.filter(item =>
        item.roles.includes(user?.role || '')
    );

    return (
        <div className="layout-container">
            <nav className="navigation-bar">
                <div className="nav-content">
                    <div className="nav-left">
                        <div
                            onClick={() => navigate('/dashboard')}
                            className="logo-section"
                        >
                            <img
                                src="/logo-wide.svg"
                                alt="Clinic Logo"
                                className="logo-image"
                            />
                            <span className="logo-text">
              </span>
                        </div>
                        <div className="nav-items">
                            {visibleNavItems.map((item) => (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="nav-right">
                        {/* User Profile */}
                        <div className="user-profile">
                            <button
                                onClick={() => navigate('/profile')}
                                className="profile-button"
                            >
                                <div className="avatar">
                                    <svg className="avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                    </svg>
                                </div>
                                <span className="user-name">{user?.firstName} {user?.lastName}</span>
                            </button>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="main-content">
                <div className="content-wrapper">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default Layout;