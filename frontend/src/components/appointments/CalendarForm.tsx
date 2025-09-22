import React, { useState, useEffect, useRef } from 'react';
import { searchService, SearchResult } from '../../services/searchService';
import AutocompleteDropdown from './AutoCompleteDropdown';

interface CalendarFormProps {
    onSubmit: (data: {
        name: string;
        email: string;
        startDate: string;
        endDate: string;
        status: string;
    }) => void;
    loading: boolean;
    nameLabel: string;
    namePlaceholder: string;
    defaultName?: string;
    defaultStartDate?: string;
    defaultEndDate?: string;
    buttonText: string;
    requireDates?: boolean;
    searchType: 'doctor' | 'patient';
}

function CalendarForm({
                          onSubmit,
                          loading,
                          nameLabel,
                          namePlaceholder,
                          defaultName = '',
                          defaultStartDate = '',
                          defaultEndDate = '',
                          buttonText,
                          requireDates = false,
                          searchType
                      }: CalendarFormProps) {

    const [formData, setFormData] = useState({
        name: defaultName,
        startDate: defaultStartDate,
        endDate: defaultEndDate,
        status: ''
    });

    // Autocomplete states
    const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const [selectedEmail, setSelectedEmail] = useState('');

    // Ref for handling clicks outside
    const nameInputRef = useRef<HTMLDivElement>(null);

    // Handle clicks outside dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (nameInputRef.current && !nameInputRef.current.contains(event.target as Node))
                setShowDropdown(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Search with debouncing
    useEffect(() => {
        if (formData.name.length >= 2 && !selectedEmail) {
            const timeoutId = setTimeout(async () => {
                setSearching(true);
                try {
                    const searchFunction = searchType === 'doctor'
                        ? searchService.searchDoctors
                        : searchService.searchPatients;

                    const results = await searchFunction(formData.name, 5);
                    setSuggestions(results.results);
                    setShowDropdown(true);
                } catch (err) {
                    console.error(`Error searching ${searchType}s:`, err);
                    setSuggestions([]);
                }
                setSearching(false);
            }, 300);

            return () => clearTimeout(timeoutId);
        } else {
            setSuggestions([]);
            setShowDropdown(false);
        }
    }, [formData.name, selectedEmail, searchType]);

    // Handle selection from dropdown
    const handleSelect = (item: SearchResult) => {
        setFormData(prev => ({
            ...prev,
            name: `${item.firstName} ${item.lastName}`
        }));
        setSelectedEmail(item.email);
        setShowDropdown(false);
        setSuggestions([]);
    };

    // Handle name input change
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, name: e.target.value }));
        if (selectedEmail)
            setSelectedEmail('');
    };

    // Handle other input changes
    const handleInputChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let email = selectedEmail;

        // If no email selected but name provided, search for exact match
        if (!email && formData.name.trim()) {
            try {
                const searchFunction = searchType === 'doctor'
                    ? searchService.searchDoctors
                    : searchService.searchPatients;

                const results = await searchFunction(formData.name, 1);
                if (results.results.length === 0) {
                    throw new Error(`${searchType === 'doctor' ? 'Doctor' : 'Patient'} not found with that name. Please select from the dropdown suggestions.`);
                }
                email = results.results[0].email;
            } catch (error: any) {
                alert(error.message);
                return;
            }
        }

        if (!email) {
            alert(`Please select a ${searchType} from the dropdown suggestions.`);
            return;
        }

        onSubmit({
            name: formData.name,
            email,
            startDate: formData.startDate,
            endDate: formData.endDate,
            status: formData.status
        });
    };

    // Update form when defaultName changes
    useEffect(() => {
        if (defaultName !== formData.name) {
            setFormData(prev => ({ ...prev, name: defaultName }));
            // If defaultName is provided and we have a way to get email, set it
            setSelectedEmail(''); // Reset email when name changes externally
        }
    }, [defaultName]);

    return (
        <form onSubmit={handleSubmit} className="calendar-form">
            <div className="form-row">
                <div className="form-group">
                    <label>{nameLabel}</label>
                    <div className="autocomplete-container" ref={nameInputRef}>
                        <input
                            type="text"
                            name="name"
                            required
                            placeholder={namePlaceholder}
                            className="form-input"
                            value={formData.name}
                            onChange={handleNameChange}
                            autoComplete="off"
                        />
                        <AutocompleteDropdown
                            suggestions={suggestions}
                            isSearching={searching}
                            isVisible={showDropdown}
                            onSelect={handleSelect}
                            type={searchType}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <label>Start Date {!requireDates && '(optional)'}</label>
                    <input
                        type="date"
                        name="startDate"
                        required={requireDates}
                        className="form-input"
                        value={formData.startDate}
                        onChange={handleInputChange('startDate')}
                    />
                </div>
                <div className="form-group">
                    <label>End Date {!requireDates && '(optional)'}</label>
                    <input
                        type="date"
                        name="endDate"
                        required={requireDates}
                        className="form-input"
                        value={formData.endDate}
                        onChange={handleInputChange('endDate')}
                    />
                </div>
                <div className="form-group">
                    <label>Status (optional)</label>
                    <select
                        name="status"
                        className="form-input"
                        value={formData.status}
                        onChange={handleInputChange('status')}
                    >
                        <option value="">All Statuses</option>
                        <option value="SCHEDULED">Scheduled</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELED">Canceled</option>
                    </select>
                </div>
            </div>
            <button type="submit" disabled={loading} className="load-calendar-btn">
                {loading ? 'Loading...' : buttonText}
            </button>
        </form>
    );
}

export default CalendarForm;