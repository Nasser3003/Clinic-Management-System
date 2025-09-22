import React from 'react';
import { SearchResult } from '../services/searchService';

interface AutocompleteDropdownProps {
    suggestions: SearchResult[];
    isSearching: boolean;
    isVisible: boolean;
    onSelect: (item: SearchResult) => void;
    type: 'doctor' | 'patient';
    className?: string;
    maxHeight?: string;
}

function AutocompleteDropdown({
                                  suggestions,
                                  isSearching,
                                  isVisible,
                                  onSelect,
                                  type,
                                  className = '',
                                  maxHeight = '180px'
                              }: AutocompleteDropdownProps) {
    if (!isVisible) return null;

    const dropdownClasses = `search-dropdown ${className}`.trim();

    return (
        <div className={dropdownClasses} style={{ maxHeight }}>
            {isSearching ? (
                <div className="search-loading">
                    <div className="loading-spinner" style={{ width: '1rem', height: '1rem', border: '2px solid #e5e7eb', borderTop: '2px solid #3b82f6' }}></div>
                    Searching...
                </div>
            ) : suggestions.length === 0 ? (
                <div className="search-no-results">
                    No {type}s found
                </div>
            ) : (
                suggestions.map((item) => (
                    <div
                        key={item.id}
                        className="search-option"
                        onClick={() => onSelect(item)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelect(item);
                            }
                        }}
                        tabIndex={0}
                        role="option"
                        aria-selected={false}
                    >
                        <div className="option-main">
                            <strong>
                                {type === 'doctor' ? 'Dr. ' : ''}
                                {item.firstName} {item.lastName}
                            </strong>
                            {item.speciality && (
                                <span className="specialty-tag">
                                    {item.speciality}
                                </span>
                            )}
                        </div>
                        <div className="option-sub">
                            {item.email}
                            {item.phone && ` • ${item.phone}`}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

export default AutocompleteDropdown;