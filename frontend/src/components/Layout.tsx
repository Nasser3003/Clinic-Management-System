import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Layout.css';
import './css/notification.css';
import SearchDropdown from './search/SearchDropdown';

interface LayoutProps {
    children: React.ReactNode;
}

interface Notification {
    id: string;
    title: string;
    description: string;
    date: Date;
    isRead: boolean;
    type: 'appointment' | 'lab' | 'payment' | 'prescription' | 'general';
}

// Notification Component (same as before - keeping existing implementation)
const NotificationComponent = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Load notifications from API
    useEffect(() => {
        loadNotifications();
    }, []);

    // Update unread count whenever notifications change
    useEffect(() => {
        const unread = notifications.filter(n => !n.isRead).length;
        setUnreadCount(unread);
    }, [notifications]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const response = await fetch('/api/notifications', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                const processedNotifications = data.map((notif: any) => ({
                    ...notif,
                    date: new Date(notif.date)
                }));
                setNotifications(processedNotifications);
            } else {
                loadMockNotifications();
            }
        } catch (error) {
            console.error('Failed to load notifications:', error);
            loadMockNotifications();
        }
    };

    const loadMockNotifications = () => {
        const mockNotifications: Notification[] = [
            {
                id: '1',
                title: 'Appointment Reminder',
                description: 'You have an upcoming appointment with Dr. Smith tomorrow at 2:00 PM.',
                date: new Date('2024-01-20T14:00:00'),
                isRead: false,
                type: 'appointment'
            },
            {
                id: '2',
                title: 'Lab Results Available',
                description: 'Your recent blood test results are now available in your medical records.',
                date: new Date('2024-01-19T09:30:00'),
                isRead: false,
                type: 'lab'
            },
            {
                id: '3',
                title: 'Payment Confirmation',
                description: 'Your payment of $150.00 for consultation has been processed successfully.',
                date: new Date('2024-01-18T16:45:00'),
                isRead: true,
                type: 'payment'
            }
        ];
        setNotifications(mockNotifications);
    };

    const handleNotificationClick = async (notificationId: string) => {
        try {
            await fetch(`/api/notifications/${notificationId}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }

        setNotifications(prev =>
            prev.map(notification =>
                notification.id === notificationId
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
    };

    const markAllAsRead = async () => {
        try {
            await fetch('/api/notifications/mark-all-read', {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to mark all notifications as read:', error);
        }

        setNotifications(prev =>
            prev.map(notification => ({ ...notification, isRead: true }))
        );
    };

    const clearAllNotifications = async () => {
        try {
            await fetch('/api/notifications', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error('Failed to clear notifications:', error);
        }

        setNotifications([]);
        setIsOpen(false);
    };

    const formatDate = (date: Date) => {
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);
        const diffInDays = Math.floor(diffInHours / 24);

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;

        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'appointment':
                return (
                    <svg className="notification-type-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                );
            case 'lab':
                return (
                    <svg className="notification-type-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v6.414l1.707 1.707A1 1 0 0115 14H5a1 1 0 01-.707-1.707L6 10.414V5zm4 3a1 1 0 112 0v2a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v2a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                );
            case 'payment':
                return (
                    <svg className="notification-type-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                    </svg>
                );
            case 'prescription':
                return (
                    <svg className="notification-type-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="notification-type-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                );
        }
    };

    const getNotificationStatus = () => {
        if (unreadCount === 0) return 'all-read';
        return 'has-unread';
    };

    return (
        <div className="notification-wrapper" ref={dropdownRef}>
            <button
                className={`notification-button ${getNotificationStatus()}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={`Notifications (${unreadCount} unread)`}
            >
                <svg className="notification-bell-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                </svg>

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3 className="notification-title">Notifications</h3>
                        <div className="notification-header-actions">
                            {unreadCount > 0 && (
                                <button
                                    className="mark-all-read-btn"
                                    onClick={markAllAsRead}
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="no-notifications">
                                <svg className="no-notifications-icon" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
                                    onClick={() => handleNotificationClick(notification.id)}
                                >
                                    <div className="notification-icon-wrapper">
                                        {getNotificationIcon(notification.type)}
                                    </div>

                                    <div className="notification-content">
                                        <div className="notification-item-header">
                                            <h4 className="notification-item-title">
                                                {notification.title}
                                            </h4>
                                            <span className="notification-time">
                                                {formatDate(notification.date)}
                                            </span>
                                        </div>

                                        <p className="notification-description">
                                            {notification.description}
                                        </p>
                                    </div>

                                    {!notification.isRead && (
                                        <div className="unread-indicator"></div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="notification-footer">
                            <button
                                className="clear-all-btn"
                                onClick={clearAllNotifications}
                            >
                                Clear all notifications
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

function Layout({ children }: LayoutProps) {
    const { user, logout, avatarKey } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navigationItems = [
        { path: '/appointments/book', label: 'Book Appointment', roles: ['PATIENT'] },
        { path: '/appointments/manage', label: 'Manage Appointments', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'EMPLOYEE'] },
        { path: '/working-schedule', label: 'Working Schedule', roles: ['ADMIN', 'DOCTOR'] },
        { path: '/treatments', label: 'Treatment Management', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'EMPLOYEE'] },
        { path: '/timeoff', label: 'Time Off', roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'EMPLOYEE', 'LAB_TECHNICIAN'] },
    ];

    const visibleNavItems = navigationItems.filter(item =>
        item.roles.includes(user?.userType || '')
    );

    const getAvatarUrl = () => {
        if (!user?.email) return '';
        return `http://localhost:3001/files/avatar/${encodeURIComponent(user.email)}?v=${avatarKey}&t=${Date.now()}`;
    };

    return (
        <div className="layout-container">
            <nav className="navigation-bar">
                <div className="nav-content">
                    <div className="nav-left">
                        <div
                            onClick={() => navigate(user ? '/dashboard' : '/')}
                            className="logo-section"
                        >
                            <img
                                src="/logo-wide.svg"
                                alt="Clinic Logo"
                                className="logo-image"
                            />
                        </div>

                        {/* Show navigation items only for authenticated users */}
                        {user && (
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
                        )}

                        {/* Public navigation items for unauthenticated users */}
                        {!user && (
                            <div className="nav-items">
                                <button
                                    onClick={() => navigate('/about')}
                                    className={`nav-item ${location.pathname === '/about' ? 'active' : ''}`}
                                >
                                    About
                                </button>
                                <button
                                    onClick={() => navigate('/contact')}
                                    className={`nav-item ${location.pathname === '/contact' ? 'active' : ''}`}
                                >
                                    Contact
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="nav-right">
                        {/* Authenticated user navigation */}
                        {user ? (
                            <>
                                <SearchDropdown />
                                <NotificationComponent />

                                <div className="user-profile">
                                    <button
                                        onClick={() => navigate('/profile')}
                                        className="profile-button"
                                    >
                                        <div className="avatar">
                                            {user?.email && getAvatarUrl() ? (
                                                <img
                                                    src={getAvatarUrl()}
                                                    alt="User Avatar"
                                                    className="avatar-image"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <svg
                                                    className="avatar-icon"
                                                    fill="white"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                                </svg>
                                            )}
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
                            </>
                        ) : (
                            /* Unauthenticated user navigation */
                            <div className="public-nav-actions">
                                <button
                                    onClick={() => navigate('/login')}
                                    className="public-login-btn"
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => navigate('/register')}
                                    className="public-register-btn"
                                >
                                    Register
                                </button>
                            </div>
                        )}
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