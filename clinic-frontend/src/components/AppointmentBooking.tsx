import React, { useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { DoctorAvailability, AvailableTimeSlot } from '../types/appointment';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';

const AppointmentBooking: React.FC = () => {
  const { user } = useAuth();
  const [bookingMode, setBookingMode] = useState<'date' | 'doctor'>('date');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [availableDoctors, setAvailableDoctors] = useState<DoctorAvailability[]>([]);
  const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
  const [allDoctors] = useState([
    { email: 'doctor@gmail.com', firstName: 'Doctor', lastName: 'Mo3a' }
  ]); // You can fetch this from backend later
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [doctorCalendar, setDoctorCalendar] = useState<any>(null);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);

  const handleModeChange = (mode: 'date' | 'doctor') => {
    setBookingMode(mode);
    // Reset all selections
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor('');
    setAvailableSlots([]);
    setAvailableDoctors([]);
    setDoctorCalendar(null);
    setAvailableDates([]);
    setUnavailableDates([]);
    setError('');
    setSuccess('');
  };

  const fetchDoctorCalendar = async (doctorEmail: string) => {
    try {
      // Fetch calendar for the next 30 days
      const today = new Date();
      const endDate = new Date();
      endDate.setDate(today.getDate() + 30);
      
      const startDateStr = today.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      console.log(`Fetching doctor calendar for ${doctorEmail} from ${startDateStr} to ${endDateStr}`);
      
      const calendar = await appointmentService.getDoctorCalendar(doctorEmail, startDateStr, endDateStr);
      setDoctorCalendar(calendar);
      
      console.log('Doctor calendar received:', calendar);
      
      // Analyze availability and create date arrays
      const available: string[] = [];
      const unavailable: string[] = [];
      
      // Generate all dates in the range and check availability
      const current = new Date(startDateStr);
      const endDateObj = new Date(endDateStr);
      while (current <= endDateObj) {
        const dateStr = current.toISOString().split('T')[0];
        const dayOfWeek = current.getDay(); // 0=Sunday, 1=Monday, etc.
        
        // Check if doctor is available on this day
        let isAvailable = false;
        
        // Check weekly schedule - if doctor has working hours this day
        if (calendar.weeklySchedule && calendar.weeklySchedule.length > 0) {
          const daySchedule = calendar.weeklySchedule.find((schedule: any) => {
            // Convert day names to numbers: SUNDAY=0, MONDAY=1, etc.
            const scheduleDayMap: { [key: string]: number } = {
              'SUNDAY': 0, 'MONDAY': 1, 'TUESDAY': 2, 'WEDNESDAY': 3,
              'THURSDAY': 4, 'FRIDAY': 5, 'SATURDAY': 6
            };
            return scheduleDayMap[schedule.dayOfWeek] === dayOfWeek;
          });
          
          if (daySchedule) {
            isAvailable = true;
          }
        }
        
        // Check time off periods - if doctor is on leave this date
        if (calendar.timeOffPeriods && calendar.timeOffPeriods.length > 0) {
          const currentDate = new Date(dateStr);
          for (const timeOff of calendar.timeOffPeriods) {
            // TimeOffDTO has startDateTime and endDateTime, not startDate/endDate
            const startDate = new Date(timeOff.startDateTime);
            const endDate = new Date(timeOff.endDateTime);
            
            // Check if current date falls within the time-off period
            const currentDateStart = new Date(currentDate);
            currentDateStart.setHours(0, 0, 0, 0);
            const currentDateEnd = new Date(currentDate);
            currentDateEnd.setHours(23, 59, 59, 999);
            
            if ((currentDateStart >= startDate && currentDateStart <= endDate) ||
                (currentDateEnd >= startDate && currentDateEnd <= endDate) ||
                (startDate >= currentDateStart && startDate <= currentDateEnd)) {
              isAvailable = false;
              break;
            }
          }
        }
        
        if (isAvailable) {
          available.push(dateStr);
        } else {
          unavailable.push(dateStr);
        }
        
        current.setDate(current.getDate() + 1);
      }
      
      console.log('Available dates:', available);
      console.log('Unavailable dates:', unavailable);
      
      setAvailableDates(available);
      setUnavailableDates(unavailable);
      
    } catch (error) {
      console.error('Error fetching doctor calendar:', error);
      
      // Fallback: if API fails, use mock availability data for testing
      console.log('Using fallback availability data due to API error');
      const available: string[] = [];
      const unavailable: string[] = [];
      
      // Generate next 30 days and mark weekdays as available, weekends as unavailable
      const fallbackToday = new Date();
      const fallbackEndDate = new Date();
      fallbackEndDate.setDate(fallbackToday.getDate() + 30);
      
      const current = new Date(fallbackToday);
      while (current <= fallbackEndDate) {
        const dateStr = current.toISOString().split('T')[0];
        const dayOfWeek = current.getDay(); // 0=Sunday, 6=Saturday
        
        // Mock logic: Available on weekdays (Monday-Friday), unavailable on weekends
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
          available.push(dateStr);
        } else {
          unavailable.push(dateStr);
        }
        
        current.setDate(current.getDate() + 1);
      }
      
      setAvailableDates(available);
      setUnavailableDates(unavailable);
      setError('Using demo availability data (weekdays only)');
    }
  };

  const handleDateChange = async (date: string) => {
    setSelectedDate(date);
    setSelectedTime('');
    setAvailableSlots([]);
    setError(''); // Clear any previous errors
    
    if (date && bookingMode === 'date') {
      // For date mode, reset doctor selection and check availability for all doctors
      setSelectedDoctor('');
      setLoading(true);
      
      try {
        // Check availability for each doctor on the selected date
        const doctorsWithAvailability = await Promise.all(
          allDoctors.map(async (doctor) => {
            try {
              // Check if doctor has any available slots on this date
              const slots = await appointmentService.getAvailableSlots(doctor.email, date, 30);
              const hasAvailableSlots = slots && slots.length > 0 && slots.some(slot => slot.available);
              
              return {
                doctorEmail: doctor.email,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                available: hasAvailableSlots
              };
            } catch (error) {
              // If API fails for this doctor, mark as unavailable
              console.error(`Failed to check availability for ${doctor.email}:`, error);
              return {
                doctorEmail: doctor.email,
                firstName: doctor.firstName,
                lastName: doctor.lastName,
                available: false
              };
            }
          })
        );
        
        setAvailableDoctors(doctorsWithAvailability);
      } catch (error) {
        console.error('Error checking doctor availability:', error);
        // Fallback: show all doctors as potentially available
        const fallbackDoctors = allDoctors.map(doctor => ({
          doctorEmail: doctor.email,
          firstName: doctor.firstName,
          lastName: doctor.lastName,
          available: true
        }));
        setAvailableDoctors(fallbackDoctors);
        setError('Unable to check doctor availability. Showing all doctors.');
      } finally {
        setLoading(false);
      }
    } else if (date && bookingMode === 'doctor' && selectedDoctor) {
      // For doctor mode, first check if the selected date is available
      const dateAvailable = isDateAvailable(date);
      if (dateAvailable === false) {
        setError(`Dr. ${allDoctors.find(d => d.email === selectedDoctor)?.firstName || ''} ${allDoctors.find(d => d.email === selectedDoctor)?.lastName || ''} is not available on ${new Date(date + 'T09:00').toLocaleDateString()}. Please select from the available dates shown above.`);
        setAvailableSlots([]);
        return;
      }
      // For doctor mode, if doctor is already selected, load time slots
      console.log('Loading slots from date change for:', { selectedDoctor, date });
      try {
        const slots = await appointmentService.getAvailableSlots(selectedDoctor, date, 30);
        console.log('Received slots from date change:', slots);
        
        // Temporary fallback for testing - remove this once API is working
        if (!slots || slots.length === 0) {
          console.log('No slots from API (date change), using mock data for testing');
          const mockSlots = [
            { startTime: '09:00', endTime: '09:30', available: true },
            { startTime: '10:00', endTime: '10:30', available: true },
            { startTime: '11:00', endTime: '11:30', available: true },
            { startTime: '14:00', endTime: '14:30', available: true },
            { startTime: '15:00', endTime: '15:30', available: true },
            { startTime: '16:00', endTime: '16:30', available: true }
          ];
          setAvailableSlots(mockSlots);
        } else {
          setAvailableSlots(slots);
        }
      } catch (err: any) {
        console.error('Error loading time slots from date change:', err);
        
        let errorMessage = 'Failed to load available time slots';
        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
        console.error('Setting error message from date change:', errorMessage);
        setError(errorMessage);
      }
    }
  };

  const handleDoctorChange = async (doctorEmail: string) => {
    setSelectedDoctor(doctorEmail);
    setSelectedTime('');
    setAvailableSlots([]);
    setError(''); // Clear any previous errors
    
    // Check if the selected doctor is available (in date mode)
    if (bookingMode === 'date' && doctorEmail && selectedDate) {
      const selectedDoctorData = availableDoctors.find(d => d.doctorEmail === doctorEmail);
      if (selectedDoctorData && !selectedDoctorData.available) {
        setError(`Dr. ${selectedDoctorData.firstName} ${selectedDoctorData.lastName} is not available on ${new Date(selectedDate + 'T09:00').toLocaleDateString()}`);
        return;
      }
    }
    
    // Fetch doctor's calendar for date highlighting (only in doctor mode)
    if (bookingMode === 'doctor' && doctorEmail) {
      await fetchDoctorCalendar(doctorEmail);
    }
    
    // Only load slots if both doctor and date are selected
    if (selectedDate && doctorEmail) {
      console.log('Loading slots for:', { doctorEmail, selectedDate });
      
      // First check if this date is marked as available for the doctor
      const dateAvailable = isDateAvailable(selectedDate);
      if (dateAvailable === false) {
        console.log('Date is marked as unavailable for doctor, not loading slots');
        setAvailableSlots([]);
        return;
      }
      
      try {
        const slots = await appointmentService.getAvailableSlots(doctorEmail, selectedDate, 30);
        console.log('Received slots:', slots);
        
        // Backend returns empty array if doctor doesn't work this day
        if (!slots || slots.length === 0) {
          console.log('No available slots returned from backend - doctor may not work this day');
          setAvailableSlots([]);
          
          // If backend says no slots but our calendar says available, there might be a discrepancy
          if (dateAvailable === true) {
            setError('Doctor is not working on ' + new Date(selectedDate + 'T09:00').toLocaleDateString());
          }
        } else {
          setAvailableSlots(slots);
          setError(''); // Clear any previous errors
        }
      } catch (err: any) {
        console.error('Error loading time slots:', err);
        
        let errorMessage = 'Failed to load available time slots';
        if (err.response?.data) {
          const data = err.response.data;
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.message) {
            errorMessage = data.message;
          }
        }
        console.error('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Backend expects dateTime in format "yyyy-MM-dd HH:mm:ss"
      const dateTime = `${selectedDate} ${selectedTime}:00`;
      const appointmentData = {
        patientEmail: user?.email || 'unknown@example.com',
        doctorEmail: selectedDoctor,
        dateTime,  // Changed from appointmentDateTime to dateTime
        duration: 30
      };
      
      console.log('Scheduling appointment with data:', appointmentData);
      await appointmentService.scheduleAppointment(appointmentData);
      setSuccess('Appointment scheduled successfully!');
      // Reset form
      setSelectedDate('');
      setSelectedTime('');
      setSelectedDoctor('');
      setAvailableSlots([]);
      setAvailableDoctors([]);
    } catch (err: any) {
      console.error('Appointment scheduling error:', err);
      
      let errorMessage = 'Failed to schedule appointment';
      
      if (err.response?.data) {
        const data = err.response.data;
        
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.details && Array.isArray(data.details)) {
          errorMessage = data.details.join(', ');
        }
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a date is available
  const isDateAvailable = (date: string): boolean | null => {
    if (availableDates.length === 0 && unavailableDates.length === 0) {
      return null; // No availability data loaded yet
    }
    return availableDates.includes(date) && !unavailableDates.includes(date);
  };

  // Helper function to get date availability message
  const getDateAvailabilityMessage = (date: string): string => {
    if (!date || bookingMode !== 'doctor' || !selectedDoctor) return '';
    
    const available = isDateAvailable(date);
    if (available === null) return '⏳ Checking availability...';
    
    if (available) {
      // If available but no slots loaded yet, check if we should load them
      if (selectedDate === date && availableSlots.length === 0) {
        return '✅ Date available - Click to load time slots';
      }
      return '✅ Available for appointments';
    } else {
      return '❌ Not available - Doctor is not working this day';
    }
  };

  // Debug logging
  console.log('Current state:', { 
    bookingMode, 
    selectedDate, 
    selectedDoctor, 
    selectedTime, 
    availableSlots: availableSlots.length, 
    availableDoctors: availableDoctors.length,
    error,
    loading 
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Book an Appointment</h2>
        
        {/* Booking Mode Selection */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <button
              type="button"
              onClick={() => handleModeChange('date')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                bookingMode === 'date'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              📅 Book by Date
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('doctor')}
              className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                bookingMode === 'doctor'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              👨‍⚕️ Book by Doctor
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {bookingMode === 'date'
              ? 'Choose a date first, then see which doctors are available'
              : 'Choose your preferred doctor, then see their available time slots'
            }
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {bookingMode === 'date' && (
            <>
              {/* Step 1: Date Selection for Date Mode */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Step 1: Select Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              {/* Step 2: Doctor Selection - Only show after date is selected */}
              {selectedDate && (
                <div>
                  <label htmlFor="doctor" className="block text-sm font-medium text-gray-700">
                    Step 2: Select Doctor
                  </label>
                  {loading ? (
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50">
                      <span className="text-gray-500">Checking doctor availability...</span>
                    </div>
                  ) : availableDoctors.length > 0 ? (
                    <select
                      id="doctor"
                      value={selectedDoctor}
                      onChange={(e) => handleDoctorChange(e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Choose your doctor</option>
                      {availableDoctors.map((doctor) => (
                        <option 
                          key={doctor.doctorEmail} 
                          value={doctor.doctorEmail}
                          disabled={!doctor.available}
                          className={!doctor.available ? 'text-gray-500' : ''}
                        >
                          Dr. {doctor.firstName} {doctor.lastName}{!doctor.available ? ' (unavailable)' : ''}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50">
                      <span className="text-gray-500">No doctors found for the selected date</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {bookingMode === 'doctor' && (
            <>
              {/* Step 1: Doctor Selection for Doctor Mode */}
              <div>
                <label htmlFor="doctor-mode" className="block text-sm font-medium text-gray-700">
                  Step 1: Select Your Preferred Doctor
                </label>
                <select
                  id="doctor-mode"
                  value={selectedDoctor}
                  onChange={(e) => handleDoctorChange(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Choose your doctor</option>
                  {allDoctors.map((doctor) => (
                    <option key={doctor.email} value={doctor.email}>
                      Dr. {doctor.firstName} {doctor.lastName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Date Selection - Only show after doctor is selected */}
              {selectedDoctor && (
                <div>
                  <label htmlFor="date-doctor-mode" className="block text-sm font-medium text-gray-700">
                    Step 2: Select Date
                  </label>
                  <input
                    type="date"
                    id="date-doctor-mode"
                    value={selectedDate}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                  {selectedDate && getDateAvailabilityMessage(selectedDate) && (
                    <p className={`mt-2 text-sm ${
                      isDateAvailable(selectedDate) ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {getDateAvailabilityMessage(selectedDate)}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {availableSlots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Step 3: Choose Time Slot
              </label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.filter(slot => slot.available).map((slot, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedTime(slot.startTime)}
                    className={`p-2 text-sm rounded-md border transition-colors ${
                      selectedTime === slot.startTime
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {slot.startTime}
                  </button>
                ))}
              </div>
              {availableSlots.filter(slot => slot.available).length === 0 && (
                <p className="text-red-600 text-sm">No available time slots for this doctor on the selected date.</p>
              )}
            </div>
          )}

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm">{success}</div>
          )}

          <button
            type="submit"
            disabled={loading || !selectedDate || !selectedDoctor || !selectedTime}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? 'Scheduling...' : 'Schedule Appointment'}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AppointmentBooking;