import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { searchService, SearchResult } from '../../services/searchService';
import './SearchDropdown.css';

interface UserTypeToggle {
    key: string;
    label: string;
    enabled: boolean;
    color: string;
}

function SearchDropdown() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const [userTypeFilters, setUserTypeFilters] = useState<UserTypeToggle[]>([
        { key: 'PATIENT', label: 'Patients', enabled: true, color: 'blue' },
        { key: 'EMPLOYEE', label: 'Employees', enabled: false, color: 'green' },
        { key: 'PARTNER', label: 'Partners', enabled: false, color: 'purple' }
    ]);

    // Set filters based on user role
    useEffect(() => {
        if (user?.userType === 'DOCTOR') {
            // Doctors can only search patients
            setUserTypeFilters([
                { key: 'PATIENT', label: 'Patients', enabled: true, color: 'blue' },
                { key: 'EMPLOYEE', label: 'Employees', enabled: false, color: 'green' },
                { key: 'PARTNER', label: 'Partners', enabled: false, color: 'purple' }
            ]);
        }
    }, [user?.userType]);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (query.length >= 2) {
                performSearch(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, userTypeFilters]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                closeDropdown();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!isOpen) return;

            switch (e.key) {
                case 'Escape':
                    closeDropdown();
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
                    break;
                case 'Enter':
                    e.preventDefault();
                    if (selectedIndex >= 0 && selectedIndex < results.length) {
                        handleSelectUser(results[selectedIndex]);
                    }
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, results, selectedIndex]);

    const openDropdown = () => {
        setIsOpen(true);
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 50);
    };

    const closeDropdown = () => {
        setIsOpen(false);
        setQuery('');
        setResults([]);
        setSelectedIndex(-1);
    };

    const performSearch = async (searchQuery: string) => {
        const enabledTypes = userTypeFilters
            .filter(filter => filter.enabled)
            .map(filter => filter.key);

        if (enabledTypes.length === 0) {
            setResults([]);
            return;
        }

        setLoading(true);
        try {
            const response = await searchService.searchUsers(searchQuery, enabledTypes, 6);
            setResults(response.results || []);
            setSelectedIndex(-1);
        } catch (error) {
            console.error('Search error:', error);
            setResults([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectUser = (selectedUser: SearchResult) => {
        closeDropdown();
        navigate(`/user/${selectedUser.email}`);
    };

    const toggleUserType = (typeKey: string) => {
        // Doctors can only search patients - prevent them from changing filters
        if (user?.userType === 'DOCTOR') {
            return;
        }

        setUserTypeFilters(prev =>
            prev.map(filter =>
                filter.key === typeKey
                    ? { ...filter, enabled: !filter.enabled }
                    : filter
            )
        );
    };

    const highlightMatch = (text: string, query: string) => {
        if (!query) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ?
                <span key={index} className="compact-search-highlight">{part}</span> :
                part
        );
    };

    const formatUserRole = (role: string) => {
        return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase().replace('_', ' ');
    };

    const getRoleCategory = (role: string) => {
        const employeeRoles = ['DOCTOR', 'NURSE', 'ADMIN', 'RECEPTIONIST', 'EMPLOYEE', 'LAB_TECHNICIAN'];
        if (role === 'PATIENT') return 'patient';
        if (role === 'PARTNER') return 'partner';
        if (employeeRoles.includes(role)) return 'employee';
        return 'employee';
    };

    const canSearch = user && ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'EMPLOYEE'].includes(user.userType);

    if (!canSearch) return null;

    return (
        <div className="compact-search-wrapper" ref={dropdownRef}>
            <button
                onClick={openDropdown}
                className="compact-search-btn"
                aria-label="Search"
                type="button"
            >
                <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>

            {isOpen && (
                <div className="compact-search-dropdown">
                    <div className="compact-search-input-section">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search patients, staff..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="compact-search-input"
                            autoComplete="off"
                        />
                        {loading && (
                            <div className="compact-search-loading">
                                <div className="compact-loading-spinner" />
                            </div>
                        )}
                    </div>

                    {/* Quick filters - hide for doctors since they can only search patients */}
                    {user?.userType !== 'DOCTOR' ? (
                        <div className="compact-filter-section">
                            {userTypeFilters.map((filter) => (
                                <button
                                    key={filter.key}
                                    onClick={() => toggleUserType(filter.key)}
                                    className={`compact-filter-btn ${filter.enabled ? 'active' : ''} ${filter.color}`}
                                    type="button"
                                >
                                    {filter.label}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <div className="compact-filter-section">
                            <div className="doctor-search-label">
                                Searching: Patients only
                            </div>
                        </div>
                    )}

                    {query.length >= 2 ? (
                        <div className="compact-search-results">
                            {results.length > 0 ? (
                                results.map((result, index) => (
                                    <div
                                        key={result.id}
                                        onClick={() => handleSelectUser(result)}
                                        onMouseEnter={() => setSelectedIndex(index)}
                                        className={`compact-result-item ${index === selectedIndex ? 'selected' : ''}`}
                                    >
                                        <div className={`compact-result-avatar ${getRoleCategory(result.role)}`}>
                                            {result.firstName.charAt(0)}{result.lastName.charAt(0)}
                                        </div>

                                        <div className="compact-result-info">
                                            <div className="compact-result-name">
                                                {highlightMatch(`${result.firstName} ${result.lastName}`, query)}
                                            </div>
                                            <div className="compact-result-details">
                                                {highlightMatch(result.email, query)}
                                            </div>
                                        </div>

                                        <div className={`compact-result-role ${getRoleCategory(result.role)}`}>
                                            {formatUserRole(result.role)}
                                        </div>
                                    </div>
                                ))
                            ) : !loading ? (
                                <div className="compact-no-results">
                                    No results for "{query}"
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="compact-search-hint">
                            Start typing to search...
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchDropdown;