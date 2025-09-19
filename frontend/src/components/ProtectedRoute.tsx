import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './css/ProtectedRoute.css';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="protected-route-loading">
                <div className="loading-container">
                    <div className="loading-spinner">
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    <div className="loading-text">Loading...</div>
                </div>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : <Navigate to="/about" />;
}

export default ProtectedRoute;