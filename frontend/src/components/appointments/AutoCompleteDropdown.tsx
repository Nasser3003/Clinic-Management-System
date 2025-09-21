
import React from 'react';
import { SearchResult } from '../../services/searchService';

interface AutocompleteDropdownProps {
    suggestions: SearchResult[];
    isSearching: boolean;
    isVisible: boolean;
    onSelect: (item: SearchResult) => void;
    type: 'doctor' | 'patient';
}

function AutocompleteDropdown({ suggestions, isSearching, isVisible, onSelect, type }: AutocompleteDropdownProps) {
    if (!isVisible) return null;

    return (
        <div className="autocomplete-dropdown">
            {isSearching ? (
                <div className="autocomplete-loading">Searching...</div>
            ) : suggestions.length === 0 ? (
                <div className="autocomplete-no-results">
                    No {type}s found
                </div>
            ) : (
                suggestions.map((item) => (
                    <div
                        key={item.id}
                        className="autocomplete-item"
                        onClick={() => onSelect(item)}
                    >
                        <div className="autocomplete-item-name">
                            {item.firstName} {item.lastName}
                        </div>
                        <div className="autocomplete-item-details">
                            {item.email}
                            {item.speciality && ` • ${item.speciality}`}
                            {item.phone && ` • ${item.phone}`}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AutocompleteDropdown;