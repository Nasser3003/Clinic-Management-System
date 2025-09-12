import React from 'react';

interface AdvancedDatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates: string[];
  unavailableDates: string[];
  minDate?: string;
  label?: string;
  required?: boolean;
  loading?: boolean;
}

function AdvancedDatePicker({
  selectedDate,
  onDateChange,
  availableDates,
  unavailableDates,
  minDate,
  label,
  required = false,
  loading = false
}: AdvancedDatePickerProps) {

  // Prevent selection of unavailable dates
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDateStr = e.target.value;
    
    if (unavailableDates.includes(selectedDateStr)) {
      // Reset to previous value or empty
      e.target.value = selectedDate;
      alert('This date is not available. Please select an available date.');
      return;
    }
    
    onDateChange(selectedDateStr);
  };

  // Create max date constraint - allow only available dates if we have that data
  const getMaxDate = () => {
    if (availableDates.length === 0) return undefined;
    
    // If we have available dates, find the latest one
    const sortedAvailableDates = [...availableDates].sort();
    const latestAvailable = sortedAvailableDates[sortedAvailableDates.length - 1];
    
    // Add 30 days to latest available date for flexibility
    const maxDate = new Date(latestAvailable + 'T12:00:00');
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="relative">
      {label && (
        <label htmlFor="advanced-date-picker" className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          type="date"
          id="advanced-date-picker"
          value={selectedDate}
          onChange={handleDateChange}
          min={minDate || new Date().toISOString().split('T')[0]}
          max={getMaxDate()}
          disabled={loading}
          className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
            loading ? 'bg-gray-100 cursor-not-allowed' : ''
          }`}
          required={required}
        />
        
        {loading && (
          <div className="absolute inset-y-0 right-8 flex items-center">
            <div className="animate-spin h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full"></div>
          </div>
        )}
      </div>
      
      {/* Warning about unavailable dates */}
      {unavailableDates.length > 0 && (
        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-sm">
          <p className="text-yellow-800">
            ⚠️ <strong>{unavailableDates.length} dates</strong> are unavailable for this doctor. 
            The date picker will prevent selection of these dates.
          </p>
        </div>
      )}
      
      {/* Legend */}
      {(availableDates.length > 0 || unavailableDates.length > 0) && (
        <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
          {availableDates.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-100 border border-green-400 rounded"></div>
              <span>Available ({availableDates.length})</span>
            </div>
          )}
          {unavailableDates.length > 0 && (
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-100 border border-red-400 rounded"></div>
              <span>Blocked ({unavailableDates.length})</span>
            </div>
          )}
        </div>
      )}
      
      {/* Quick selection buttons for available dates */}
      {availableDates.length > 0 && availableDates.length <= 15 && (
        <div className="mt-3">
          <p className="text-sm text-gray-700 mb-2 font-medium">✅ Available dates - Click to select:</p>
          <div className="flex flex-wrap gap-1">
            {availableDates.slice(0, 10).map(dateStr => (
              <button
                key={dateStr}
                type="button"
                onClick={() => onDateChange(dateStr)}
                className={`px-3 py-1 text-sm rounded border transition-colors ${
                  selectedDate === dateStr
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                }`}
              >
                {new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { 
                  weekday: 'short',
                  month: 'short', 
                  day: 'numeric' 
                })}
              </button>
            ))}
            {availableDates.length > 10 && (
              <span className="px-2 py-1 text-sm text-gray-500">
                +{availableDates.length - 10} more available
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdvancedDatePicker;