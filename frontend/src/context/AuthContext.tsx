import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/auth';
import { authService } from '../services/authService';

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedUser = authService.getCurrentUser();

        if (token && savedUser) {
            setUser(savedUser);
        }
        setLoading(false);
    }, []);

    const login = (token: string, userData: User) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setAvatarKey(0); // Reset avatar key on logout
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