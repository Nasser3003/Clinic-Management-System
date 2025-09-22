import React, { useState } from 'react';
import { appointmentService } from '../services/appointmentService';
import { DoctorAvailability, AvailableTimeSlot } from '../types/appointment';
import { useAuth } from '../context/AuthContext';
import Layout from './Layout';
import './css/AppointmentBooking.css';

function AppointmentBooking() {
    const { user } = useAuth();
    const [bookingMode, setBookingMode] = useState<'date' | 'doctor'>('date');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [availableDoctors, setAvailableDoctors] = useState<DoctorAvailability[]>([]);
    const [availableSlots, setAvailableSlots] = useState<AvailableTimeSlot[]>([]);
    const [allDoctors] = useState([
        { email: 'doctor@gmail.com', firstName: 'Doctor', lastName: 'Mo3a' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [availableDates, setAvailableDates] = useState<string[]>([]);
    const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
    const [reason, setReason] = useState('General consultation');

    const handleModeChange = (mode: 'date' | 'doctor') => {
        setBookingMode(mode);
        setSelectedDate('');
        setSelectedTime('');
        setSelectedDoctor('');
        setAvailableSlots([]);
        setAvailableDoctors([]);
        setAvailableDates([]);
        setUnavailableDates([]);
        setError('');
        setSuccess('');
    };

    const fetchDoctorCalendar = async (doctorEmail: string) => {
        try {
            const today = new Date();
            const endDate = new Date();
            endDate.setDate(today.getDate() + 30);

            const startDateStr = today.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            const calendar = await appointmentService.getDoctorCalendar(doctorEmail, startDateStr, endDateStr);

            const available: string[] = [];
            const unavailable: string[] = [];

            const current = new Date(startDateStr);
            const endDateObj = new Date(endDateStr);
            while (current <= endDateObj) {
                const dateStr = current.toISOString().split('T')[0];
                const dayOfWeek = current.getDay();

                let isAvailable = false;

                if (calendar.weeklySchedule && calendar.weeklySchedule.length > 0) {
                    const daySchedule = calendar.weeklySchedule.find((schedule: any) => {
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

                if (calendar.timeOffPeriods && calendar.timeOffPeriods.length > 0) {
                    const currentDate = new Date(dateStr);
                    for (const timeOff of calendar.timeOffPeriods) {
                        const startDate = new Date(timeOff.startDateTime);
                        const endDate = new Date(timeOff.endDateTime);

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

            setAvailableDates(available);
            setUnavailableDates(unavailable);

        } catch (error) {
            console.error('Error fetching doctor calendar:', error);

            const available: string[] = [];
            const unavailable: string[] = [];

            const fallbackToday = new Date();
            const fallbackEndDate = new Date();
            fallbackEndDate.setDate(fallbackToday.getDate() + 30);

            const current = new Date(fallbackToday);
            while (current <= fallbackEndDate) {
                const dateStr = current.toISOString().split('T')[0];
                const dayOfWeek = current.getDay();

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
        setError('');

        if (date && bookingMode === 'date') {
            setSelectedDoctor('');
            setLoading(true);

            try {
                const doctorsWithAvailability = await Promise.all(
                    allDoctors.map(async (doctor) => {
                        try {
                            const slots = await appointmentService.getAvailableSlots(doctor.email, date, 30);
                            const hasAvailableSlots = slots && slots.length > 0 && slots.some(slot => slot.available);

                            return {
                                doctorEmail: doctor.email,
                                firstName: doctor.firstName,
                                lastName: doctor.lastName,
                                available: hasAvailableSlots
                            };
                        } catch (error) {
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
            const dateAvailable = isDateAvailable(date);
            if (dateAvailable === false) {
                setError(`Dr. ${allDoctors.find(d => d.email === selectedDoctor)?.firstName || ''} ${allDoctors.find(d => d.email === selectedDoctor)?.lastName || ''} is not available on ${new Date(date + 'T09:00').toLocaleDateString()}. Please select from the available dates shown above.`);
                setAvailableSlots([]);
                return;
            }
            try {
                const slots = await appointmentService.getAvailableSlots(selectedDoctor, date, 30);

                if (!slots || slots.length === 0) {
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
                setError(errorMessage);
            }
        }
    };

    const handleDoctorChange = async (doctorEmail: string) => {
        setSelectedDoctor(doctorEmail);
        setSelectedTime('');
        setAvailableSlots([]);
        setError('');

        if (bookingMode === 'date' && doctorEmail && selectedDate) {
            const selectedDoctorData = availableDoctors.find(d => d.doctorEmail === doctorEmail);
            if (selectedDoctorData && !selectedDoctorData.available) {
                setError(`Dr. ${selectedDoctorData.firstName} ${selectedDoctorData.lastName} is not available on ${new Date(selectedDate + 'T09:00').toLocaleDateString()}`);
                return;
            }
        }

        if (bookingMode === 'doctor' && doctorEmail) {
            await fetchDoctorCalendar(doctorEmail);
        }

        if (selectedDate && doctorEmail) {
            const dateAvailable = isDateAvailable(selectedDate);
            if (dateAvailable === false) {
                setAvailableSlots([]);
                return;
            }

            try {
                const slots = await appointmentService.getAvailableSlots(doctorEmail, selectedDate, 30);

                if (!slots || slots.length === 0) {
                    setAvailableSlots([]);

                    if (dateAvailable === true) {
                        setError('Doctor is not working on ' + new Date(selectedDate + 'T09:00').toLocaleDateString());
                    }
                } else {
                    setAvailableSlots(slots);
                    setError('');
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
            const dateTime = `${selectedDate} ${selectedTime}:00`;
            const appointmentData = {
                patientEmail: user?.email || 'unknown@example.com',
                doctorEmail: selectedDoctor,
                dateTime,
                duration: 30,
                reason: reason.trim() || 'General consultation'
            };

            await appointmentService.scheduleAppointment(appointmentData);
            setSuccess('Appointment scheduled successfully!');
            setSelectedDate('');
            setSelectedTime('');
            setSelectedDoctor('');
            setAvailableSlots([]);
            setAvailableDoctors([]);
            setReason('General consultation');
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

    const isDateAvailable = (date: string): boolean | null => {
        if (availableDates.length === 0 && unavailableDates.length === 0) {
            return null;
        }
        return availableDates.includes(date) && !unavailableDates.includes(date);
    };

    const getDateAvailabilityMessage = (date: string): string => {
        if (!date || bookingMode !== 'doctor' || !selectedDoctor) return '';

        const available = isDateAvailable(date);
        if (available === null) return 'Checking availability...';

        if (available) {
            if (selectedDate === date && availableSlots.length === 0) {
                return 'Date available - Click to load time slots';
            }
            return 'Available for appointments';
        } else {
            return 'Not available - Doctor is not working this day';
        }
    };

    return (
        <Layout>
            <div className="appointment-booking">
                <h2 className="booking-title">Book an Appointment</h2>

                {/* Booking Mode Selection */}
                <div className="booking-mode-section">
                    <div className="mode-buttons">
                        <button
                            type="button"
                            onClick={() => handleModeChange('date')}
                            className={`mode-btn ${bookingMode === 'date' ? 'active' : ''}`}
                        >
                            📅 Book by Date
                        </button>
                        <button
                            type="button"
                            onClick={() => handleModeChange('doctor')}
                            className={`mode-btn ${bookingMode === 'doctor' ? 'active' : ''}`}
                        >
                            👨‍⚕️ Book by Doctor
                        </button>
                    </div>
                    <p className="mode-description">
                        {bookingMode === 'date'
                            ? 'Choose a date first, then see which doctors are available'
                            : 'Choose your preferred doctor, then see their available time slots'
                        }
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="booking-form">
                    {bookingMode === 'date' && (
                        <>
                            {/* Step 1: Date Selection for Date Mode */}
                            <div className="form-step">
                                <label htmlFor="date" className="step-label">
                                    Step 1: Select Date
                                </label>
                                <input
                                    type="date"
                                    id="date"
                                    value={selectedDate}
                                    onChange={(e) => handleDateChange(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="date-input"
                                    required
                                />
                            </div>

                            {/* Step 2: Doctor Selection */}
                            {selectedDate && (
                                <div className="form-step">
                                    <label htmlFor="doctor" className="step-label">
                                        Step 2: Select Doctor
                                    </label>
                                    {loading ? (
                                        <div className="loading-state">
                                            <span className="loading-text">Checking doctor availability...</span>
                                        </div>
                                    ) : availableDoctors.length > 0 ? (
                                        <select
                                            id="doctor"
                                            value={selectedDoctor}
                                            onChange={(e) => handleDoctorChange(e.target.value)}
                                            className="doctor-select"
                                            required
                                        >
                                            <option value="">Choose your doctor</option>
                                            {availableDoctors.map((doctor) => (
                                                <option
                                                    key={doctor.doctorEmail}
                                                    value={doctor.doctorEmail}
                                                    disabled={!doctor.available}
                                                >
                                                    Dr. {doctor.firstName} {doctor.lastName}{!doctor.available ? ' (unavailable)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <div className="no-doctors">
                                            <span className="no-doctors-text">No doctors found for the selected date</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {bookingMode === 'doctor' && (
                        <>
                            {/* Step 1: Doctor Selection for Doctor Mode */}
                            <div className="form-step">
                                <label htmlFor="doctor-mode" className="step-label">
                                    Step 1: Select Your Preferred Doctor
                                </label>
                                <select
                                    id="doctor-mode"
                                    value={selectedDoctor}
                                    onChange={(e) => handleDoctorChange(e.target.value)}
                                    className="doctor-select"
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

                            {/* Step 2: Date Selection */}
                            {selectedDoctor && (
                                <div className="form-step">
                                    <div className="date-selection">
                                        <label htmlFor="date" className="step-label">
                                            Step 2: Select Date
                                        </label>
                                        <input
                                            type="date"
                                            id="date"
                                            value={selectedDate}
                                            onChange={(e) => handleDateChange(e.target.value)}
                                            min={new Date().toISOString().split('T')[0]}
                                            required
                                            className="date-input"
                                        />
                                    </div>
                                    {selectedDate && getDateAvailabilityMessage(selectedDate) && (
                                        <p className={`availability-message ${
                                            isDateAvailable(selectedDate) ? 'available' : 'unavailable'
                                        }`}>
                                            {getDateAvailabilityMessage(selectedDate)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </>
                    )}

                    {availableSlots.length > 0 && (
                        <div className="form-step">
                            <label className="step-label">
                                Step 3: Choose Time Slot
                            </label>
                            <div className="time-slots-grid">
                                {availableSlots.filter(slot => slot.available).map((slot, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setSelectedTime(slot.startTime)}
                                        className={`time-slot ${selectedTime === slot.startTime ? 'selected' : ''}`}
                                    >
                                        {slot.startTime}
                                    </button>
                                ))}
                            </div>
                            {availableSlots.filter(slot => slot.available).length === 0 && (
                                <p className="no-slots">No available time slots for this doctor on the selected date.</p>
                            )}
                        </div>
                    )}

                    {/* Reason field */}
                    {selectedDate && selectedDoctor && selectedTime && (
                        <div className="form-step">
                            <label htmlFor="reason" className="step-label">
                                Reason for Visit (Optional)
                            </label>
                            <textarea
                                id="reason"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Enter the reason for your appointment..."
                                className="reason-input"
                                rows={3}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="error-message">{error}</div>
                    )}

                    {success && (
                        <div className="success-message">{success}</div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !selectedDate || !selectedDoctor || !selectedTime}
                        className="submit-btn"
                    >
                        {loading ? 'Scheduling...' : 'Schedule Appointment'}
                    </button>
                </form>
            </div>
        </Layout>
    );
}

export default AppointmentBooking;