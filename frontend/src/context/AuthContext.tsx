import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';
import { decodeJWT, extractUserRole, extractUserPermissions } from '../utils/jwtDecoder';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    updateUser: (userData: User) => void;
    loading: boolean;
    avatarKey: number;
    refreshAvatar: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [avatarKey, setAvatarKey] = useState(0);

    // Helper function to create user from JWT token
    const createUserFromToken = (token: string): User | null => {
        try {
            const payload = decodeJWT(token);
            if (!payload) {
                console.error('Invalid JWT token');
                return null;
            }

            console.log('JWT Payload:', payload);

            const userType = extractUserRole(token);
            const permissions = extractUserPermissions(token);

            console.log('Extracted UserType:', userType);
            console.log('Extracted Permissions:', permissions);

            const user: User = {
                id: payload.sub,
                email: payload.email,
                firstName: payload.firstName,
                lastName: payload.lastName,
                userType: userType,
                permissions: permissions,
                // Add other optional fields if they exist in the JWT
                phoneNumber: payload.phoneNumber,
                gender: payload.gender,
                dateOfBirth: payload.dateOfBirth,
                emergencyContactName: payload.emergencyContactName,
                emergencyContactNumber: payload.emergencyContactNumber,
                nationalId: payload.nationalId
            };

            console.log('Created User Object:', user);
            return user;
        } catch (error) {
            console.error('Error creating user from token:', error);
            return null;
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            // Instead of using authService.getCurrentUser(), create user from JWT
            const userFromToken = createUserFromToken(token);

            if (userFromToken) {
                setUser(userFromToken);
                // Save the correctly structured user to localStorage
                localStorage.setItem('user', JSON.stringify(userFromToken));
            } else {
                // Invalid token, clean up
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        console.log('Login called with token and user data');

        // Create user from token to ensure correct structure
        const userFromToken = createUserFromToken(token);

        if (userFromToken) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userFromToken));
            setUser(userFromToken);
        } else {
            console.error('Failed to create user from token during login');
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setAvatarKey(0);
    };

    const updateUser = (userData: User) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const refreshAvatar = () => {
        setAvatarKey(prev => prev + 1);
    };

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            updateUser,
            loading,
            avatarKey,
            refreshAvatar
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};