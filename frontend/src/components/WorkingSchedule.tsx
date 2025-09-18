import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/WorkingSchedule.css';
import HeroHeader from "./common/HeroHeader";

// Types
interface TimeSlot {
    start: string;
    end: string;
}

interface DaySchedule {
    dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY';
    isWorking: boolean;
    timeSlots: TimeSlot[];
}

interface WorkingScheduleData {
    doctorEmail: string;
    weeklySchedule: DaySchedule[];
}

interface Employee {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

// Main Component
function WorkingScheduleManager() {
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    // State management
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
        isAdmin ? null : {
            id: user?.id || '',
            email: user?.email || '',
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            role: user?.role || ''
        }
    );
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loadingEmployees, setLoadingEmployees] = useState(isAdmin);

    const [schedule, setSchedule] = useState<WorkingScheduleData>({
        doctorEmail: user?.email || '',
        weeklySchedule: [
            { dayOfWeek: 'MONDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
            { dayOfWeek: 'TUESDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
            { dayOfWeek: 'WEDNESDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
            { dayOfWeek: 'THURSDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
            { dayOfWeek: 'FRIDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
            { dayOfWeek: 'SATURDAY', isWorking: false, timeSlots: [] },
            { dayOfWeek: 'SUNDAY', isWorking: false, timeSlots: [] }
        ]
    });

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Constants
    const dayDisplayNames = {
        'MONDAY': 'Monday',
        'TUESDAY': 'Tuesday',
        'WEDNESDAY': 'Wednesday',
        'THURSDAY': 'Thursday',
        'FRIDAY': 'Friday',
        'SATURDAY': 'Saturday',
        'SUNDAY': 'Sunday'
    };

    // Load employees list for admin
    useEffect(() => {
        if (isAdmin) {
            loadEmployees();
        }
    }, [isAdmin]);

    // Filter employees based on search query
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredEmployees(employees);
        } else {
            const query = searchQuery.toLowerCase();
            const filtered = employees.filter(employee =>
                employee.firstName.toLowerCase().includes(query) ||
                employee.lastName.toLowerCase().includes(query) ||
                `${employee.firstName} ${employee.lastName}`.toLowerCase().includes(query) ||
                employee.role.toLowerCase().includes(query) ||
                employee.email.toLowerCase().includes(query)
            );
            setFilteredEmployees(filtered);
        }
    }, [employees, searchQuery]);

    // Load current schedule when employee is selected
    useEffect(() => {
        if (selectedEmployee) {
            loadCurrentSchedule();
        }
    }, [selectedEmployee]);

    // Load employees list for admin
    const loadEmployees = async () => {
        setLoadingEmployees(true);
        try {
            // Simulate API call to get employees who can have working schedules
            // const response = await api.get('/admin/employees?roles=DOCTOR,NURSE,LAB_TECHNICIAN,EMPLOYEE');

            // Mock data for demonstration
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockEmployees: Employee[] = [
                { id: '1', email: 'doctor@gmail.com', firstName: 'Doctor', lastName: 'Mo3a', role: 'DOCTOR' },
                { id: '2', email: 'nurse@gmail.com', firstName: 'Sarah', lastName: 'Johnson', role: 'NURSE' },
                { id: '3', email: 'lab@gmail.com', firstName: 'Mike', lastName: 'Wilson', role: 'LAB_TECHNICIAN' },
                { id: '4', email: 'employee@gmail.com', firstName: 'Alice', lastName: 'Brown', role: 'EMPLOYEE' },
                { id: '5', email: 'doctor2@gmail.com', firstName: 'John', lastName: 'Smith', role: 'DOCTOR' },
                { id: '6', email: 'nurse2@gmail.com', firstName: 'Emma', lastName: 'Davis', role: 'NURSE' },
                { id: '7', email: 'lab2@gmail.com', firstName: 'Robert', lastName: 'Miller', role: 'LAB_TECHNICIAN' },
                { id: '8', email: 'employee2@gmail.com', firstName: 'Lisa', lastName: 'Anderson', role: 'EMPLOYEE' },
            ];

            setEmployees(mockEmployees);
            setFilteredEmployees(mockEmployees);
        } catch (error) {
            console.error('Error loading employees:', error);
            setMessage({ type: 'error', text: 'Failed to load employees list' });
        } finally {
            setLoadingEmployees(false);
        }
    };

    // Load current schedule from API
    const loadCurrentSchedule = async () => {
        if (!selectedEmployee?.email) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            // Simulate API call - replace with actual API endpoint
            // const response = await api.get(`/calendar/schedule/${selectedEmployee.email}`);

            // Mock API response
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Update the schedule with the selected employee's email
            setSchedule(prev => ({
                ...prev,
                doctorEmail: selectedEmployee.email
            }));

            // If schedule exists, update state
            // setSchedule(response.data);

            setMessage({ type: 'success', text: `Schedule loaded successfully for ${selectedEmployee.firstName} ${selectedEmployee.lastName}` });
        } catch (error) {
            console.error('Error loading schedule:', error);
            setMessage({ type: 'error', text: 'Using default schedule. Unable to load existing schedule.' });
        } finally {
            setLoading(false);
        }
    };

    // Handle search input change
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    // Clear search
    const clearSearch = () => {
        setSearchQuery('');
    };

    // Handle employee selection
    const handleEmployeeSelection = (employeeId: string) => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (employee) {
            setSelectedEmployee(employee);
            setMessage({ type: '', text: '' });
        }
    };

    // Toggle working status for a day
    const toggleDayWorking = (dayOfWeek: string) => {
        setSchedule(prev => ({
            ...prev,
            weeklySchedule: prev.weeklySchedule.map(day =>
                day.dayOfWeek === dayOfWeek
                    ? {
                        ...day,
                        isWorking: !day.isWorking,
                        timeSlots: !day.isWorking ? [{ start: '09:00', end: '17:00' }] : []
                    }
                    : day
            )
        }));
        setMessage({ type: '', text: '' });
    };

    // Update time slot
    const updateTimeSlot = (dayOfWeek: string, slotIndex: number, field: 'start' | 'end', value: string) => {
        setSchedule(prev => ({
            ...prev,
            weeklySchedule: prev.weeklySchedule.map(day =>
                day.dayOfWeek === dayOfWeek
                    ? {
                        ...day,
                        timeSlots: day.timeSlots.map((slot, index) =>
                            index === slotIndex
                                ? { ...slot, [field]: value }
                                : slot
                        )
                    }
                    : day
            )
        }));
        setMessage({ type: '', text: '' });
    };

    // Add new time slot to a day
    const addTimeSlot = (dayOfWeek: string) => {
        const day = schedule.weeklySchedule.find(d => d.dayOfWeek === dayOfWeek);
        if (!day || day.timeSlots.length >= 3) return;

        const lastSlot = day.timeSlots[day.timeSlots.length - 1];
        const newStart = lastSlot ? addHour(lastSlot.end) : '09:00';
        const newEnd = addHour(newStart);

        setSchedule(prev => ({
            ...prev,
            weeklySchedule: prev.weeklySchedule.map(d =>
                d.dayOfWeek === dayOfWeek
                    ? {
                        ...d,
                        timeSlots: [...d.timeSlots, { start: newStart, end: newEnd }]
                    }
                    : d
            )
        }));
    };

    // Remove time slot
    const removeTimeSlot = (dayOfWeek: string, slotIndex: number) => {
        setSchedule(prev => ({
            ...prev,
            weeklySchedule: prev.weeklySchedule.map(day =>
                day.dayOfWeek === dayOfWeek
                    ? {
                        ...day,
                        timeSlots: day.timeSlots.filter((_, index) => index !== slotIndex)
                    }
                    : day
            )
        }));
    };

    // Helper function to add an hour to time string
    const addHour = (timeString: string): string => {
        const [hours, minutes] = timeString.split(':').map(Number);
        const newHours = (hours + 1) % 24;
        return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    // Validate schedule
    const validateSchedule = (): { isValid: boolean; error?: string } => {
        for (const day of schedule.weeklySchedule) {
            if (day.isWorking && day.timeSlots.length === 0) {
                return {
                    isValid: false,
                    error: `${dayDisplayNames[day.dayOfWeek]} is marked as working but has no time slots`
                };
            }

            for (let i = 0; i < day.timeSlots.length; i++) {
                const slot = day.timeSlots[i];

                // Check if start time is before end time
                if (slot.start >= slot.end) {
                    return {
                        isValid: false,
                        error: `Invalid time slot on ${dayDisplayNames[day.dayOfWeek]}: start time must be before end time`
                    };
                }

                // Check for overlapping slots
                for (let j = i + 1; j < day.timeSlots.length; j++) {
                    const otherSlot = day.timeSlots[j];
                    if (slot.start < otherSlot.end && slot.end > otherSlot.start) {
                        return {
                            isValid: false,
                            error: `Overlapping time slots on ${dayDisplayNames[day.dayOfWeek]}`
                        };
                    }
                }
            }
        }
        return { isValid: true };
    };

    // Save schedule
    const handleSaveSchedule = async () => {
        const validation = validateSchedule();
        if (!validation.isValid) {
            setMessage({ type: 'error', text: validation.error || 'Invalid schedule' });
            return;
        }

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // API call to save schedule
            // await api.post('/calendar/schedule', schedule);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            setMessage({
                type: 'success',
                text: `Working schedule updated successfully for ${selectedEmployee?.firstName} ${selectedEmployee?.lastName}!`
            });
        } catch (error) {
            console.error('Error saving schedule:', error);
            setMessage({ type: 'error', text: 'Failed to save schedule. Please try again.' });
        } finally {
            setSaving(false);
        }
    };

    // Reset to default schedule
    const handleResetSchedule = () => {
        setSchedule({
            doctorEmail: selectedEmployee?.email || '',
            weeklySchedule: [
                { dayOfWeek: 'MONDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
                { dayOfWeek: 'TUESDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
                { dayOfWeek: 'WEDNESDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
                { dayOfWeek: 'THURSDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
                { dayOfWeek: 'FRIDAY', isWorking: true, timeSlots: [{ start: '09:00', end: '17:00' }] },
                { dayOfWeek: 'SATURDAY', isWorking: false, timeSlots: [] },
                { dayOfWeek: 'SUNDAY', isWorking: false, timeSlots: [] }
            ]
        });
        setMessage({ type: 'success', text: 'Schedule reset to default values' });
    };

    // Loading state for employees
    if (loadingEmployees) {
        return (
            <Layout>
                <div className="working-schedule-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading employees list...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    // Employee selection for admin
    if (isAdmin && !selectedEmployee) {
        return (
            <Layout>
                <div className="working-schedule-container">
                    <HeroHeader
                        title="Working Schedule Management"
                        subtitle="Select an employee to manage their working schedule"
                    />

                    <div className="employee-selection-container">
                        <div className="employee-selection-header">
                            <h3 className="employee-selection-title">Select Employee</h3>
                            <p className="employee-selection-subtitle">
                                Choose an employee to view and manage their working schedule
                            </p>

                            {/* Search Bar */}
                            <div className="employee-search-container">
                                <div className="search-input-wrapper">
                                    <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <input
                                        type="text"
                                        placeholder="Search employees by name, role, or email..."
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        className="search-input"
                                    />
                                    {searchQuery && (
                                        <button
                                            onClick={clearSearch}
                                            className="clear-search-btn"
                                            aria-label="Clear search"
                                        >
                                            <svg className="clear-icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    )}
                                </div>

                                {/* Search Results Count */}
                                <div className="search-results-info">
                                    {searchQuery ? (
                                        <span className="results-count">
                                            {filteredEmployees.length} of {employees.length} employees found
                                        </span>
                                    ) : (
                                        <span className="total-count">
                                            {employees.length} employees available
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="employees-grid">
                            {filteredEmployees.length > 0 ? (
                                filteredEmployees.map((employee) => (
                                    <div
                                        key={employee.id}
                                        className="employee-card"
                                        onClick={() => handleEmployeeSelection(employee.id)}
                                    >
                                        <div className="employee-avatar">
                                            <svg className="employee-avatar-icon" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                            </svg>
                                        </div>
                                        <div className="employee-info">
                                            <h4 className="employee-name">
                                                {employee.firstName} {employee.lastName}
                                            </h4>
                                            <p className="employee-role">{employee.role}</p>
                                            <p className="employee-email">{employee.email}</p>
                                        </div>
                                        <div className="employee-select-icon">
                                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="no-results">
                                    <div className="no-results-icon">
                                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                        </svg>
                                    </div>
                                    <h4 className="no-results-title">No employees found</h4>
                                    <p className="no-results-text">
                                        Try adjusting your search terms or clear the search to see all employees.
                                    </p>
                                    {searchQuery && (
                                        <button onClick={clearSearch} className="clear-search-action-btn">
                                            Clear Search
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Loading state for schedule
    if (loading) {
        return (
            <Layout>
                <div className="working-schedule-container">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Loading working schedule...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div>
                <HeroHeader
                    title="Working Schedule Management"
                    subtitle={
                        isAdmin && selectedEmployee
                            ? `Managing schedule for ${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.role})`
                            : "Set your weekly working hours and availability for appointments"
                    }
                />

                {/* Admin Back Button */}
                {isAdmin && selectedEmployee && (
                    <div className="admin-navigation">
                        <button
                            onClick={() => setSelectedEmployee(null)}
                            className="back-to-selection-btn"
                        >
                            <svg className="icon" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Back to Employee Selection
                        </button>
                    </div>
                )}

                {message.text && (
                    <div className={`schedule-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                {/* Main Schedule Container */}
                <div className="schedule-main-container">
                    <div className="schedule-section-header">
                        <h3 className="schedule-section-title">
                            Weekly Schedule
                            {isAdmin && selectedEmployee && (
                                <span className="employee-badge">
                                    {selectedEmployee.firstName} {selectedEmployee.lastName}
                                </span>
                            )}
                        </h3>
                    </div>

                    <div className="schedule-content">
                        <div className="schedule-days-grid">
                            {schedule.weeklySchedule.map((day) => (
                                <div
                                    key={day.dayOfWeek}
                                    className={`schedule-day-card ${day.isWorking ? 'working' : 'not-working'}`}
                                >
                                    {/* Day Header */}
                                    <div className="day-header">
                                        <h4 className="day-name">
                                            {dayDisplayNames[day.dayOfWeek]}
                                        </h4>

                                        {/* Working Toggle Switch */}
                                        <button
                                            onClick={() => toggleDayWorking(day.dayOfWeek)}
                                            className={`working-toggle ${day.isWorking ? 'active' : 'inactive'}`}
                                            aria-label={`Toggle working status for ${dayDisplayNames[day.dayOfWeek]}`}
                                        >
                                            <span className={`toggle-slider ${day.isWorking ? 'active' : 'inactive'}`} />
                                        </button>
                                    </div>

                                    {/* Time Slots - Only show if working */}
                                    {day.isWorking && (
                                        <div className="time-slots-container">
                                            {day.timeSlots.map((slot, index) => (
                                                <div key={index} className="time-slot-row">
                                                    <input
                                                        type="time"
                                                        value={slot.start}
                                                        onChange={(e) => updateTimeSlot(day.dayOfWeek, index, 'start', e.target.value)}
                                                        className="time-input"
                                                        aria-label={`Start time for slot ${index + 1}`}
                                                    />
                                                    <span className="time-separator">to</span>
                                                    <input
                                                        type="time"
                                                        value={slot.end}
                                                        onChange={(e) => updateTimeSlot(day.dayOfWeek, index, 'end', e.target.value)}
                                                        className="time-input"
                                                        aria-label={`End time for slot ${index + 1}`}
                                                    />
                                                    {day.timeSlots.length > 1 && (
                                                        <button
                                                            onClick={() => removeTimeSlot(day.dayOfWeek, index)}
                                                            className="remove-slot-btn"
                                                            aria-label={`Remove time slot ${index + 1}`}
                                                        >
                                                            <svg className="icon" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    )}
                                                </div>
                                            ))}

                                            {/* Add Time Slot Button - Maximum 3 slots per day */}
                                            {day.timeSlots.length < 3 && (
                                                <button
                                                    onClick={() => addTimeSlot(day.dayOfWeek)}
                                                    className="add-slot-btn"
                                                    aria-label={`Add time slot to ${dayDisplayNames[day.dayOfWeek]}`}
                                                >
                                                    <svg className="icon" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                    </svg>
                                                    Add Time Slot
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Not Working Message */}
                                    {!day.isWorking && (
                                        <div className="not-working-message">
                                            Not working
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="schedule-actions">
                        <button
                            onClick={handleResetSchedule}
                            className="reset-btn"
                            disabled={saving}
                        >
                            Reset to Default
                        </button>

                        <button
                            onClick={handleSaveSchedule}
                            disabled={saving}
                            className="save-btn"
                        >
                            {saving ? 'Saving...' : 'Save Schedule'}
                        </button>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export default WorkingScheduleManager;