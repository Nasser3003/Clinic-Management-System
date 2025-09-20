import api from './api';
import { adminService } from './adminService';
import { PERMISSIONS } from '../types/auth';

// Types matching your backend DTOs
export interface ScheduleSlotDTO {
    dayOfWeek: string;
    startTime: string; // LocalTime in "HH:mm" format
    endTime: string;   // LocalTime in "HH:mm" format
}

export interface Employee {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

// Transform backend ScheduleSlotDTO to frontend TimeSlot format
const transformScheduleSlotToTimeSlot = (slot: ScheduleSlotDTO) => {
    // Handle both string and LocalTime object formats
    const formatTime = (time: any): string => {
        if (typeof time === 'string') {
            // Handle "HH:mm:ss" format (remove seconds)
            if (time.includes(':')) {
                const parts = time.split(':');
                if (parts.length >= 2)
                    return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
            }
        }

        // If it's a LocalTime object (has hour, minute properties)
        if (time && typeof time === 'object' && 'hour' in time && 'minute' in time) {
            return `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
        }

        // If it's a time object with different structure
        if (time && typeof time === 'object') {
            // Try common time object patterns
            if (time.hours !== undefined && time.minutes !== undefined)
                return `${time.hours.toString().padStart(2, '0')}:${time.minutes.toString().padStart(2, '0')}`;
            if (time.h !== undefined && time.m !== undefined)
                return `${time.h.toString().padStart(2, '0')}:${time.m.toString().padStart(2, '0')}`;
        }

        // Fallback - return as string and hope for the best
        console.warn('Unexpected time format:', time);
        return String(time);
    };

    return {
        start: formatTime(slot.startTime),
        end: formatTime(slot.endTime)
    };
};

// Transform frontend schedule to backend format
const transformScheduleToBackend = (schedule: any) => {
    const slots: ScheduleSlotDTO[] = [];

    schedule.weeklySchedule.forEach((day: any) => {
        if (day.isWorking && day.timeSlots.length > 0) {
            day.timeSlots.forEach((slot: any) => {
                slots.push({
                    dayOfWeek: day.dayOfWeek,
                    startTime: slot.start,
                    endTime: slot.end
                });
            });
        }
    });

    return slots;
};

// Transform backend schedule to frontend format
const transformBackendSchedule = (scheduleSlots: ScheduleSlotDTO[], employeeEmail: string) => {
    const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

    // Group slots by day
    const slotsByDay = scheduleSlots.reduce((acc, slot) => {
        if (!acc[slot.dayOfWeek])
            acc[slot.dayOfWeek] = [];
        acc[slot.dayOfWeek].push(transformScheduleSlotToTimeSlot(slot));
        return acc;
    }, {} as Record<string, any[]>);

    // Create weekly schedule
    const weeklySchedule = dayOrder.map(dayOfWeek => ({
        dayOfWeek: dayOfWeek as any,
        isWorking: slotsByDay[dayOfWeek]?.length > 0 || false,
        timeSlots: slotsByDay[dayOfWeek] || []
    }));

    return {
        doctorEmail: employeeEmail,
        weeklySchedule
    };
};

// Helper function to compare time slots
const areSlotsEqual = (slot1: any, slot2: any) => {
    return slot1.start === slot2.start && slot1.end === slot2.end;
};

// Helper function to compare day schedules
const areDaySchedulesEqual = (day1: any, day2: any) => {
    if (day1.isWorking !== day2.isWorking) return false;
    if (day1.timeSlots.length !== day2.timeSlots.length) return false;

    // Sort slots by start time for comparison
    const sortedSlots1 = [...day1.timeSlots].sort((a, b) => a.start.localeCompare(b.start));
    const sortedSlots2 = [...day2.timeSlots].sort((a, b) => a.start.localeCompare(b.start));

    return sortedSlots1.every((slot, index) => areSlotsEqual(slot, sortedSlots2[index]));
};

// Create a merged schedule with original and modified data
export const scheduleService = {
    // Store original schedule for comparison
    _originalSchedule: null as any,

    // Check permissions for schedule management
    canViewSchedule: (): boolean => {
        return adminService.checkAnyPermission([
            PERMISSIONS.USER_READ,
            PERMISSIONS.ADMIN_USER_MANAGEMENT
        ]);
    },

    canManageSchedule: (): boolean => {
        return adminService.checkAnyPermission([
            PERMISSIONS.USER_UPDATE,
            PERMISSIONS.ADMIN_USER_MANAGEMENT
        ]);
    },

    // Get employee schedule and store original for comparison
    getEmployeeSchedule: async (email?: string) => {
        if (!scheduleService.canViewSchedule()) {
            throw new Error('Access denied: Insufficient permissions to view schedules');
        }

        try {
            let url = '/schedules/get-schedule';
            if (email)
                url += `?email=${encodeURIComponent(email)}`;
            const response = await api.get(url);
            const scheduleSlots: ScheduleSlotDTO[] = response.data;

            // Debug: Log the raw data from backend
            console.log('Raw schedule data from backend:', scheduleSlots);

            // Debug: Log a sample slot to see its structure
            if (scheduleSlots.length > 0) {
                console.log('Sample slot structure:', scheduleSlots[0]);
                console.log('Sample startTime type:', typeof scheduleSlots[0].startTime);
                console.log('Sample startTime value:', scheduleSlots[0].startTime);
            }

            const transformedSchedule = transformBackendSchedule(scheduleSlots, email || '');

            // Debug: Log the transformed schedule
            console.log('Transformed schedule:', transformedSchedule);

            // Store original schedule for later comparison
            scheduleService._originalSchedule = JSON.parse(JSON.stringify(transformedSchedule));

            return transformedSchedule;
        } catch (error: any) {
            console.error('Error fetching employee schedule:', error);
            if (error.response?.status === 403) {
                throw new Error('Access denied: You do not have permission to view this schedule');
            }
            if (error.response?.status === 404) {
                // For new schedules, store empty original
                const defaultSchedule = scheduleService.getDefaultSchedule(email || '');
                scheduleService._originalSchedule = JSON.parse(JSON.stringify(defaultSchedule));
                throw new Error('Schedule not found for the specified employee');
            }
            throw new Error('Failed to load employee schedule');
        }
    },

    // Save employee schedule with day-based updates (simplified approach)
    saveEmployeeSchedule: async (schedule: any) => {
        if (!scheduleService.canManageSchedule())
            throw new Error('Access denied: Insufficient permissions to manage schedules');

        try {
            const scheduleSlots = transformScheduleToBackend(schedule);

            // Use the CreateScheduleRequestDTO format
            const createScheduleRequest = {
                email: schedule.doctorEmail,
                schedule: scheduleSlots
            };

            await api.post('/schedules/create-schedule', createScheduleRequest);

            // Update the stored original schedule after successful save
            scheduleService._originalSchedule = JSON.parse(JSON.stringify(schedule));

        } catch (error: any) {
            console.error('Error saving employee schedule:', error);
            if (error.response?.status === 403) {
                throw new Error('Access denied: You do not have permission to modify this schedule');
            }
            if (error.response?.status === 400) {
                throw new Error('Invalid schedule data: Please check your time slots for conflicts');
            }
            throw new Error('Failed to save employee schedule');
        }
    },

    // Save only specific days that have changed (day-level patches)
    saveEmployeeScheduleByDays: async (schedule: any, changedDays: string[]) => {
        if (!scheduleService.canManageSchedule())
            throw new Error('Access denied: Insufficient permissions to manage schedules')

        try {
            // Create schedule with only the changed days
            const changedSchedule = {
                ...schedule,
                weeklySchedule: schedule.weeklySchedule.filter((day: any) =>
                    changedDays.includes(day.dayOfWeek)
                )
            };

            const scheduleSlots = transformScheduleToBackend(changedSchedule);

            const createScheduleRequest = {
                email: schedule.doctorEmail,
                schedule: scheduleSlots
            };

            await api.post('/schedules/create-schedule', createScheduleRequest);

            // Update the stored original schedule after successful save
            scheduleService._originalSchedule = JSON.parse(JSON.stringify(schedule));

        } catch (error: any) {
            console.error('Error saving employee schedule:', error);
            if (error.response?.status === 403)
                throw new Error('Access denied: You do not have permission to modify this schedule');

            if (error.response?.status === 400)
                throw new Error('Invalid schedule data: Please check your time slots for conflicts');

            throw new Error('Failed to save employee schedule');
        }
    },

    // Get what has changed in the current schedule
    getScheduleChanges: (currentSchedule: any) => {
        if (!scheduleService._originalSchedule)
            return { hasChanges: true, changedDays: [], isNewSchedule: true };


        const changedDays: string[] = [];
        const dayOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

        dayOrder.forEach(dayOfWeek => {
            const originalDay = scheduleService._originalSchedule.weeklySchedule.find(
                (day: any) => day.dayOfWeek === dayOfWeek
            );
            const currentDay = currentSchedule.weeklySchedule.find(
                (day: any) => day.dayOfWeek === dayOfWeek
            );

            if (!originalDay || !currentDay || !areDaySchedulesEqual(originalDay, currentDay)) {
                changedDays.push(dayOfWeek);
            }
        });

        return {
            hasChanges: changedDays.length > 0,
            changedDays,
            isNewSchedule: false
        };
    },

    // Reset original schedule (useful when switching employees)
    resetOriginalSchedule: () => {
        scheduleService._originalSchedule = null;
    },

    // Get employees who can have schedules (doctors, nurses, staff)
    getScheduleableEmployees: async (): Promise<Employee[]> => {
        if (!adminService.checkPermission(PERMISSIONS.USER_READ))
            throw new Error('Access denied: USER_READ permission required');

        try {
            // Get all staff members (excludes patients and admins typically)
            const [doctors, staff] = await Promise.all([
                adminService.getAllDoctors().catch(() => []),
                adminService.getAllStaff().catch(() => [])
            ]);

            // Combine and transform to Employee interface
            const allEmployees = [...doctors, ...staff].map(emp => ({
                id: emp.id?.toString() || '',
                email: emp.email,
                firstName: emp.firstName,
                lastName: emp.lastName,
                role: emp.userType || 'EMPLOYEE'
            }));

            // Remove duplicates based on email
            const uniqueEmployees = allEmployees.filter((employee, index, self) =>
                index === self.findIndex(e => e.email === employee.email)
            );

            return uniqueEmployees;
        } catch (error: any) {
            console.error('Error fetching scheduleable employees:', error);
            if (error.response?.status === 403)
                throw new Error('Access denied: You do not have permission to view employees');
            throw new Error('Failed to load employees list');
        }
    },

    // Validate schedule data before saving
    validateSchedule: (schedule: any): { isValid: boolean; error?: string } => {
        const dayDisplayNames: Record<string, string> = {
            'MONDAY': 'Monday',
            'TUESDAY': 'Tuesday',
            'WEDNESDAY': 'Wednesday',
            'THURSDAY': 'Thursday',
            'FRIDAY': 'Friday',
            'SATURDAY': 'Saturday',
            'SUNDAY': 'Sunday'
        };

        for (const day of schedule.weeklySchedule) {
            if (day.isWorking && day.timeSlots.length === 0) {
                return {
                    isValid: false,
                    error: `${dayDisplayNames[day.dayOfWeek]} is marked as working but has no time slots`
                };
            }

            // Skip validation if not working or no time slots
            if (!day.isWorking || day.timeSlots.length === 0)
                continue;

            // Sort time slots by start time for overlap checking
            const sortedSlots = [...day.timeSlots].sort((a, b) => a.start.localeCompare(b.start));

            for (let i = 0; i < sortedSlots.length; i++) {
                const slot = sortedSlots[i];

                // Check if slot exists and has valid properties
                if (!slot || typeof slot.start !== 'string' || typeof slot.end !== 'string') {
                    console.error('Invalid slot data:', slot);
                    return {
                        isValid: false,
                        error: `Invalid time slot data on ${dayDisplayNames[day.dayOfWeek]}`
                    };
                }

                // Clean the time strings (remove any whitespace)
                const startTime = slot.start.trim();
                const endTime = slot.end.trim();

                // More flexible time format validation (supports HH:mm and HH:mm:ss)
                const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

                if (!timeRegex.test(startTime)) {
                    console.error('Invalid start time format:', startTime);
                    return {
                        isValid: false,
                        error: `Invalid start time format on ${dayDisplayNames[day.dayOfWeek]}: "${startTime}". Expected format: HH:mm`
                    };
                }

                if (!timeRegex.test(endTime)) {
                    console.error('Invalid end time format:', endTime);
                    return {
                        isValid: false,
                        error: `Invalid end time format on ${dayDisplayNames[day.dayOfWeek]}: "${endTime}". Expected format: HH:mm`
                    };
                }

                // Check if start time is before end time
                if (startTime >= endTime) {
                    return {
                        isValid: false,
                        error: `Invalid time slot on ${dayDisplayNames[day.dayOfWeek]}: start time (${startTime}) must be before end time (${endTime})`
                    };
                }

                // Check for overlapping slots with next slot
                if (i < sortedSlots.length - 1) {
                    const nextSlot = sortedSlots[i + 1];
                    const nextStartTime = nextSlot.start.trim();

                    if (endTime > nextStartTime) {
                        return {
                            isValid: false,
                            error: `Overlapping time slots on ${dayDisplayNames[day.dayOfWeek]}: ${startTime}-${endTime} overlaps with ${nextStartTime}-${nextSlot.end.trim()}`
                        };
                    }
                }
            }
        }

        return { isValid: true };
    },

    // Get default empty schedule
    getDefaultSchedule: (employeeEmail: string = '') => ({
        doctorEmail: employeeEmail,
        weeklySchedule: [
            { dayOfWeek: 'MONDAY' as const, isWorking: false, timeSlots: [] },
            { dayOfWeek: 'TUESDAY' as const, isWorking: false, timeSlots: [] },
            { dayOfWeek: 'WEDNESDAY' as const, isWorking: false, timeSlots: [] },
            { dayOfWeek: 'THURSDAY' as const, isWorking: false, timeSlots: [] },
            { dayOfWeek: 'FRIDAY' as const, isWorking: false, timeSlots: [] },
            { dayOfWeek: 'SATURDAY' as const, isWorking: false, timeSlots: [] },
            { dayOfWeek: 'SUNDAY' as const, isWorking: false, timeSlots: [] }
        ]
    })
};