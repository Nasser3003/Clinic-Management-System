import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import Dashboard from './components/Dashboard';
import AppointmentBooking from './components/AppointmentBooking';
import Contact from './components/Contact';
import AboutUs from './components/AboutUs';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import TreatmentManagement from './components/TreatmentDetails';
import TimeOffManagement from './components/dashboard/timeOff/TimeOffManagement';
import AppointmentsManagement from './components//dashboard/schedule/AppointmentsManagement';

function App() {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/appointments/book"
                            element={
                                <ProtectedRoute>
                                    <AppointmentBooking />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/contact"
                            element={
                                <ProtectedRoute>
                                    <Contact />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/about"
                            element={
                                <ProtectedRoute>
                                    <AboutUs />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <UserProfile />
                                </ProtectedRoute>
                            }
                        />
                        {/* FIXED ROUTE BELOW */}
                        <Route
                            path="/treatments"
                            element={
                                <ProtectedRoute>
                                    <TreatmentManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/timeoff"
                            element={
                                <ProtectedRoute>
                                    <TimeOffManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/appointments/manage"
                            element={
                                <ProtectedRoute>
                                    <AppointmentsManagement />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
}

export default App;
