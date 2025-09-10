import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', roles: ['ADMIN', 'EMPLOYEE', 'PATIENT'] },
    { path: '/appointments/book', label: 'Book Appointment', roles: ['PATIENT'] },
    { path: '/about', label: 'About Us', roles: ['ADMIN', 'EMPLOYEE', 'PATIENT'] },
    { path: '/contact', label: 'Contact', roles: ['ADMIN', 'EMPLOYEE', 'PATIENT'] },
  ];

  const visibleNavItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-semibold text-gray-900">Clinic Dashboard</h1>
              <div className="flex space-x-4">
                {visibleNavItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === item.path
                        ? 'bg-indigo-100 text-indigo-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* User Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                    </svg>
                  </div>
                  <span>{user?.firstName} {user?.lastName}</span>
                </button>
              </div>
              
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;