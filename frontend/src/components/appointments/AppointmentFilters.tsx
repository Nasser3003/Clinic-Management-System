import React, { useState, useEffect, useRef } from 'react';
import { searchService, SearchResult } from '../../services/searchService';
import AutocompleteDropdown from '../AutoCompleteDropdown';

interface AppointmentFiltersState {
    status: string;
    doctorName: string;
    patientName: string;
    startDate: string;
    endDate: string;
}

interface AppointmentFiltersProps {
    filters: AppointmentFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<AppointmentFiltersState>>;
    isAdmin: boolean;
    isEmployee: boolean;
}

function AppointmentFilters({
                                filters,
                                setFilters,
                                isAdmin,
                                isEmployee
                            }: AppointmentFiltersProps) {
    // Autocomplete states for doctors
    const [doctorSuggestions, setDoctorSuggestions] = useState<SearchResult[]>([]);
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [searchingDoctors, setSearchingDoctors] = useState(false);
    const [selectedDoctorEmail, setSelectedDoctorEmail] = useState('');

    // Autocomplete states for patients
    const [patientSuggestions, setPatientSuggestions] = useState<SearchResult[]>([]);
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const [searchingPatients, setSearchingPatients] = useState(false);
    const [selectedPatientEmail, setSelectedPatientEmail] = useState('');

    // Refs for handling clicks outside
    const doctorInputRef = useRef<HTMLDivElement>(null);
    const patientInputRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (doctorInputRef.current && !doctorInputRef.current.contains(event.target as Node))
                setShowDoctorDropdown(false);
            if (patientInputRef.current && !patientInputRef.current.contains(event.target as Node))
                setShowPatientDropdown(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search doctors with debouncing
    useEffect(() => {
        if (filters.doctorName.length >= 2 && !selectedDoctorEmail) {
            const timeoutId = setTimeout(async () => {
                setSearchingDoctors(true);
                try {
                    const results = await searchService.searchDoctors(filters.doctorName, 5);
                    console.log('Doctor search results:', results); // Debug log
                    setDoctorSuggestions(results.results);
                    setShowDoctorDropdown(true);
                } catch (err) {
                    console.error('Error searching doctors:', err);
                    setDoctorSuggestions([]);
                }
                setSearchingDoctors(false);
            }, 300);

            return () => clearTimeout(timeoutId);
        } else {
            setDoctorSuggestions([]);
            setShowDoctorDropdown(false);
        }
    }, [filters.doctorName, selectedDoctorEmail]);

    // Search patients with debouncing
    useEffect(() => {
        if (filters.patientName.length >= 2 && !selectedPatientEmail) {
            const timeoutId = setTimeout(async () => {
                setSearchingPatients(true);
                try {
                    const results = await searchService.searchPatients(filters.patientName, 5);
                    console.log('Patient search results:', results); // Debug log
                    setPatientSuggestions(results.results);
                    setShowPatientDropdown(true);
                } catch (err) {
                    console.error('Error searching patients:', err);
                    setPatientSuggestions([]);
                }
                setSearchingPatients(false);
            }, 300);

            return () => clearTimeout(timeoutId);
        } else {
            setPatientSuggestions([]);
            setShowPatientDropdown(false);
        }
    }, [filters.patientName, selectedPatientEmail]);

    // Handle doctor selection
    const handleDoctorSelect = (doctor: SearchResult) => {
        setFilters(prev => ({
            ...prev,
            doctorName: `${doctor.firstName} ${doctor.lastName}`
        }));
        setSelectedDoctorEmail(doctor.email);
        setShowDoctorDropdown(false);
        setDoctorSuggestions([]);
    };

    // Handle patient selection
    const handlePatientSelect = (patient: SearchResult) => {
        setFilters(prev => ({
            ...prev,
            patientName: `${patient.firstName} ${patient.lastName}`
        }));
        setSelectedPatientEmail(patient.email);
        setShowPatientDropdown(false);
        setPatientSuggestions([]);
    };

    // Handle doctor input change
    const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, doctorName: e.target.value }));
        if (selectedDoctorEmail)
            setSelectedDoctorEmail('');
    };

    // Handle patient input change
    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, patientName: e.target.value }));
        if (selectedPatientEmail)
            setSelectedPatientEmail('');
    };

    // Clear all filters
    const clearFilters = () => {
        setFilters({
            status: '',
            doctorName: '',
            patientName: '',
            startDate: '',
            endDate: ''
        });
        setSelectedDoctorEmail('');
        setSelectedPatientEmail('');
        setDoctorSuggestions([]);
        setPatientSuggestions([]);
        setShowDoctorDropdown(false);
        setShowPatientDropdown(false);
    };

    return (
        <div className="filters-section">
            <div className="filters-grid">
                <div className="filter-group">
                    <label>Status</label>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELED">Canceled</option>
                    </select>
                </div>

                {(isAdmin || isEmployee) && (
                    <>
                        <div className="filter-group">
                            <label>Doctor Name</label>
                            <div className="autocomplete-container" ref={doctorInputRef}>
                                <input
                                    type="text"
                                    value={filters.doctorName}
                                    onChange={handleDoctorInputChange}
                                    placeholder="Search doctor name..."
                                    className="filter-input"
                                    autoComplete="off"
                                />
                                <AutocompleteDropdown
                                    suggestions={doctorSuggestions}
                                    isSearching={searchingDoctors}
                                    isVisible={showDoctorDropdown}
                                    onSelect={handleDoctorSelect}
                                    type="doctor"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Patient Name</label>
                            <div className="autocomplete-container" ref={patientInputRef}>
                                <input
                                    type="text"
                                    value={filters.patientName}
                                    onChange={handlePatientInputChange}
                                    placeholder="Search patient name..."
                                    className="filter-input"
                                    autoComplete="off"
                                />
                                <AutocompleteDropdown
                                    suggestions={patientSuggestions}
                                    isSearching={searchingPatients}
                                    isVisible={showPatientDropdown}
                                    onSelect={handlePatientSelect}
                                    type="patient"
                                />
                            </div>
                        </div>
                    </>
                )}

                <div className="filter-group">
                    <label>Start Date</label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="filter-input"
                    />
                </div>

                <div className="filter-group">
                    <label>End Date</label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="filter-input"
                    />
                </div>
            </div>

            <div className="filter-actions">
                <button
                    onClick={clearFilters}
                    className="clear-filters-btn"
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}

export default AppointmentFilters;