import React, { useState, useEffect, useRef } from 'react';
import { searchService, SearchResult } from '../../services/searchService';
import AutocompleteDropdown from '../AutoCompleteDropdown';

interface TreatmentFiltersState {
    patientEmail: string;
    doctorEmail: string;
    paid: string;
    startDate: string;
    endDate: string;
    prescriptionKeyword: string;
    visitNotesKeyword: string;
}

interface TreatmentFiltersProps {
    filters: TreatmentFiltersState;
    setFilters: React.Dispatch<React.SetStateAction<TreatmentFiltersState>>;
    isAdmin: boolean;
    isEmployee: boolean;
    onClearFilters: () => void;
}

function TreatmentFilters({
                              filters,
                              setFilters,
                              isAdmin,
                              isEmployee,
                              onClearFilters
                          }: TreatmentFiltersProps) {
    // Autocomplete states for doctors
    const [doctorSuggestions, setDoctorSuggestions] = useState<SearchResult[]>([]);
    const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
    const [searchingDoctors, setSearchingDoctors] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState<SearchResult | null>(null);

    // Autocomplete states for patients
    const [patientSuggestions, setPatientSuggestions] = useState<SearchResult[]>([]);
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);
    const [searchingPatients, setSearchingPatients] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<SearchResult | null>(null);

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
        if (filters.doctorEmail.length >= 2 && !selectedDoctor) {
            const timeoutId = setTimeout(async () => {
                setSearchingDoctors(true);
                try {
                    const results = await searchService.searchDoctors(filters.doctorEmail, 5);
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
    }, [filters.doctorEmail, selectedDoctor]);

    // Search patients with debouncing
    useEffect(() => {
        if (filters.patientEmail.length >= 2 && !selectedPatient) {
            const timeoutId = setTimeout(async () => {
                setSearchingPatients(true);
                try {
                    const results = await searchService.searchPatients(filters.patientEmail, 5);
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
    }, [filters.patientEmail, selectedPatient]);

    // Handle doctor selection
    const handleDoctorSelect = (doctor: SearchResult) => {
        setSelectedDoctor(doctor);
        setFilters(prev => ({
            ...prev,
            doctorEmail: doctor.email
        }));
        setShowDoctorDropdown(false);
        setDoctorSuggestions([]);
    };

    // Handle patient selection
    const handlePatientSelect = (patient: SearchResult) => {
        setSelectedPatient(patient);
        setFilters(prev => ({
            ...prev,
            patientEmail: patient.email
        }));
        setShowPatientDropdown(false);
        setPatientSuggestions([]);
    };

    // Handle doctor input change
    const handleDoctorInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, doctorEmail: e.target.value }));
        if (selectedDoctor)
            setSelectedDoctor(null);
    };

    // Handle patient input change
    const handlePatientInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters(prev => ({ ...prev, patientEmail: e.target.value }));
        if (selectedPatient)
            setSelectedPatient(null);
    };

    // Clear selection handlers
    const handleClearDoctor = () => {
        setSelectedDoctor(null);
        setFilters(prev => ({ ...prev, doctorEmail: '' }));
        setDoctorSuggestions([]);
        setShowDoctorDropdown(false);
    };

    const handleClearPatient = () => {
        setSelectedPatient(null);
        setFilters(prev => ({ ...prev, patientEmail: '' }));
        setPatientSuggestions([]);
        setShowPatientDropdown(false);
    };

    // Clear all filters
    const handleClearFilters = () => {
        setFilters({
            patientEmail: '',
            doctorEmail: '',
            paid: '',
            startDate: '',
            endDate: '',
            prescriptionKeyword: '',
            visitNotesKeyword: ''
        });
        setSelectedDoctor(null);
        setSelectedPatient(null);
        setDoctorSuggestions([]);
        setPatientSuggestions([]);
        setShowDoctorDropdown(false);
        setShowPatientDropdown(false);
        onClearFilters();
    };

    const getDoctorDisplayValue = () => {
        if (selectedDoctor)
            return `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}`;
        return filters.doctorEmail;
    };

    const getPatientDisplayValue = () => {
        if (selectedPatient)
            return `${selectedPatient.firstName} ${selectedPatient.lastName}`;
        return filters.patientEmail;
    };

    return (
        <div className="filters-section">
            <div className="filters-grid compact">
                {(isAdmin || isEmployee) && (
                    <>
                        <div className="filter-group">
                            <label>
                                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                </svg>
                                Doctor
                            </label>
                            <div className="search-container" ref={doctorInputRef}>
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        value={getDoctorDisplayValue()}
                                        onChange={handleDoctorInputChange}
                                        placeholder="Search doctor..."
                                        className="filter-input compact search-input"
                                        autoComplete="off"
                                        readOnly={!!selectedDoctor}
                                    />
                                    {selectedDoctor && (
                                        <button
                                            type="button"
                                            onClick={handleClearDoctor}
                                            className="clear-selection-btn"
                                            title="Clear selection"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
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
                            <label>
                                <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                                Patient
                            </label>
                            <div className="search-container" ref={patientInputRef}>
                                <div className="search-input-wrapper">
                                    <input
                                        type="text"
                                        value={getPatientDisplayValue()}
                                        onChange={handlePatientInputChange}
                                        placeholder="Search patient..."
                                        className="filter-input compact search-input"
                                        autoComplete="off"
                                        readOnly={!!selectedPatient}
                                    />
                                    {selectedPatient && (
                                        <button
                                            type="button"
                                            onClick={handleClearPatient}
                                            className="clear-selection-btn"
                                            title="Clear selection"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
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
                    <label>
                        <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                        </svg>
                        Status
                    </label>
                    <select
                        value={filters.paid}
                        onChange={(e) => setFilters(prev => ({ ...prev, paid: e.target.value }))}
                        className="filter-select compact"
                    >
                        <option value="">All</option>
                        <option value="true">Paid</option>
                        <option value="false">Outstanding</option>
                    </select>
                </div>

                <div className="filter-group">
                    <label>
                        <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        From
                    </label>
                    <input
                        type="date"
                        value={filters.startDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value }))}
                        className="filter-input compact"
                    />
                </div>

                <div className="filter-group">
                    <label>
                        <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                        </svg>
                        To
                    </label>
                    <input
                        type="date"
                        value={filters.endDate}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value }))}
                        className="filter-input compact"
                    />
                </div>

                <div className="filter-group">
                    <label>
                        <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
                        </svg>
                        Prescriptions
                    </label>
                    <input
                        type="text"
                        value={filters.prescriptionKeyword}
                        onChange={(e) => setFilters(prev => ({ ...prev, prescriptionKeyword: e.target.value }))}
                        placeholder="Search meds"
                        className="filter-input search-input compact"
                    />
                </div>

                <div className="filter-group">
                    <label>
                        <svg className="field-icon" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        Notes
                    </label>
                    <input
                        type="text"
                        value={filters.visitNotesKeyword}
                        onChange={(e) => setFilters(prev => ({ ...prev, visitNotesKeyword: e.target.value }))}
                        placeholder="Search notes"
                        className="filter-input search-input compact"
                    />
                </div>
            </div>

            <div className="filter-actions compact">
                <button
                    onClick={handleClearFilters}
                    className="clear-filters-btn"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
}

export default TreatmentFilters;