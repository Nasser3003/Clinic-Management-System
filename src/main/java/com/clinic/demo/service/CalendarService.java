package com.clinic.demo.service;

import com.clinic.demo.DTO.calenderDTO.*;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.ScheduleEntity;
import com.clinic.demo.models.entity.TimeOff;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.AppointmentRepository;
import com.clinic.demo.repository.ScheduleRepository;
import com.clinic.demo.repository.TimeOffRepository;
import com.clinic.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CalendarService {

    private final AppointmentRepository appointmentRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;
    private final TimeOffRepository timeOffRepository;
    private final AppointmentService appointmentService;
    private final UserValidationService userValidationService;

    /**
     * Get available time slots for a doctor on a specific date
     */
    public List<AvailableTimeSlotDTO> getAvailableSlots(String doctorEmail, LocalDate date, int appointmentDuration) {
        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);

        // Get doctor's schedule for the day
        Optional<ScheduleEntity> scheduleOpt = scheduleRepository
                .findByEmployeeAndDayOfWeek(doctor, date.getDayOfWeek());

        if (scheduleOpt.isEmpty()) {
            return Collections.emptyList(); // Doctor doesn't work this day
        }

        ScheduleEntity schedule = scheduleOpt.get();

        // Check if doctor has time off on this date
        if (isDoctorOnTimeOff(doctor, date)) {
            return Collections.emptyList();
        }

        // Get existing appointments for this doctor on this date
        List<AppointmentEntity> existingAppointments = findAppointmentsByDoctorAndDateRange(
                doctor,
                date.atTime(schedule.getStartTime()),
                date.atTime(schedule.getEndTime())
        );

        // Generate available slots
        return generateAvailableSlots(schedule, existingAppointments, date, appointmentDuration);
    }

    /**
     * Get doctor's calendar view with appointments, schedule and time off
     */
    public DoctorCalendarViewDTO getDoctorCalendarView(String doctorEmail, LocalDate startDate, LocalDate endDate) {
        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);

        // Get appointments in date range
        List<AppointmentEntity> appointments = findAppointmentsByDoctorAndDateRange(
                doctor,
                startDate.atStartOfDay(),
                endDate.atTime(23, 59, 59)
        );

        // Get doctor's weekly schedule
        List<ScheduleEntity> weeklySchedule = scheduleRepository.findByEmployee(doctor);

        // Get time off periods in date range
        List<TimeOff> timeOffPeriods = getTimeOffInRange(doctor, startDate, endDate);

        return DoctorCalendarViewDTO.builder()
                .doctorName(doctor.getFirstName() + " " + doctor.getLastName())
                .doctorEmail(doctor.getEmail())
                .startDate(startDate)
                .endDate(endDate)
                .appointments(appointments.stream().map(this::mapToAppointmentDTO).collect(Collectors.toList()))
                .weeklySchedule(weeklySchedule.stream().map(this::mapToScheduleDTO).collect(Collectors.toList()))
                .timeOffPeriods(timeOffPeriods.stream().map(this::mapToTimeOffDTO).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get patient's appointment calendar view
     */
    public PatientCalendarViewDTO getPatientCalendarView(String patientEmail, LocalDate startDate, LocalDate endDate) {
        // Get patient's appointments using the correct method name from repository
        List<AppointmentEntity> appointments = appointmentRepository
                .findByPatient_EmailAndStartDateTimeBetween(
                        patientEmail,
                        startDate.atStartOfDay(),
                        endDate.atTime(23, 59, 59)
                );

        return PatientCalendarViewDTO.builder()
                .patientEmail(patientEmail)
                .startDate(startDate)
                .endDate(endDate)
                .appointments(appointments.stream().map(this::mapToAppointmentDTO).collect(Collectors.toList()))
                .build();
    }

    /**
     * Get available doctors for a specific date and time
     */
    public List<DoctorAvailabilityDTO> getAvailableDoctors(LocalDate date, LocalTime startTime, int duration) {
        List<EmployeeEntity> allDoctors = userRepository.findALlByUserType(UserTypeEnum.DOCTOR);

        return allDoctors.stream()
                .map(doctor -> {
                    LocalDateTime dateTime = date.atTime(startTime);
                    boolean isAvailable = isDoctorAvailableForAppointment(doctor, dateTime, duration);

                    return DoctorAvailabilityDTO.builder()
                            .doctorId(doctor.getId())
                            .firstName(doctor.getFirstName())
                            .lastName(doctor.getLastName())
                            .email(doctor.getEmail())
                            .available(isAvailable)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Check if doctor is available for an appointment at specific date/time
     */
    private boolean isDoctorAvailableForAppointment(EmployeeEntity doctor, LocalDateTime dateTime, int duration) {
        try {
            // First check if doctor is working at this time
            if (!isDoctorWorkingLocal(doctor, dateTime)) {
                return false;
            }

            // Then check if doctor is available (no conflicting appointments)
            return isDoctorAvailableLocal(doctor, dateTime, duration);
        } catch (Exception e) {
            log.warn("Error checking doctor availability for {}: {}", doctor.getEmail(), e.getMessage());
            return false;
        }
    }

    /**
     * Check if doctor is available (no conflicting appointments)
     */
    private boolean isDoctorAvailableLocal(EmployeeEntity doctor, LocalDateTime dateTime, int duration) {
        LocalDateTime endDateTime = dateTime.plusMinutes(duration);

        // Get all appointments for this doctor
        List<AppointmentEntity> doctorAppointments = appointmentRepository.findAllByDoctor(doctor);

        // Check for conflicts with the requested time slot
        return doctorAppointments.stream()
                .noneMatch(apt -> {
                    // Check if appointments overlap
                    return dateTime.isBefore(apt.getEndDateTime()) &&
                            endDateTime.isAfter(apt.getStartDateTime());
                });
    }

    /**
     * Check if doctor is working at the specified time
     */
    private boolean isDoctorWorkingLocal(EmployeeEntity doctor, LocalDateTime dateTime) {
        LocalDate date = dateTime.toLocalDate();
        LocalTime time = dateTime.toLocalTime();

        // Check if doctor has time off on this date
        if (isDoctorOnTimeOff(doctor, date)) {
            return false;
        }

        // Check if doctor has a schedule for this day of week
        Optional<ScheduleEntity> scheduleOpt = scheduleRepository
                .findByEmployeeAndDayOfWeek(doctor, date.getDayOfWeek());

        if (scheduleOpt.isEmpty()) {
            return false;
        }

        ScheduleEntity schedule = scheduleOpt.get();
        return !time.isBefore(schedule.getStartTime()) && !time.isAfter(schedule.getEndTime());
    }

    /**
     * Find appointments by doctor within a date range
     * This uses the existing repository method and filters by date range
     */
    private List<AppointmentEntity> findAppointmentsByDoctorAndDateRange(
            EmployeeEntity doctor, LocalDateTime start, LocalDateTime end) {

        // Get all appointments for this doctor
        List<AppointmentEntity> allDoctorAppointments = appointmentRepository.findAllByDoctor(doctor);

        // Filter by date range
        return allDoctorAppointments.stream()
                .filter(apt ->
                        !apt.getStartDateTime().isBefore(start) &&
                                !apt.getStartDateTime().isAfter(end)
                )
                .collect(Collectors.toList());
    }

    private List<AvailableTimeSlotDTO> generateAvailableSlots(
            ScheduleEntity schedule,
            List<AppointmentEntity> existingAppointments,
            LocalDate date,
            int appointmentDuration) {

        List<AvailableTimeSlotDTO> availableSlots = new ArrayList<>();
        LocalTime current = schedule.getStartTime();
        LocalTime endTime = schedule.getEndTime();

        while (current.plusMinutes(appointmentDuration).isBefore(endTime) ||
                current.plusMinutes(appointmentDuration).equals(endTime)) {

            LocalDateTime slotDateTime = date.atTime(current);
            LocalDateTime slotEndDateTime = slotDateTime.plusMinutes(appointmentDuration);

            // Check if this slot conflicts with existing appointments
            boolean isAvailable = existingAppointments.stream()
                    .noneMatch(apt ->
                            (slotDateTime.isBefore(apt.getEndDateTime()) &&
                                    slotEndDateTime.isAfter(apt.getStartDateTime()))
                    );

            if (isAvailable) {
                availableSlots.add(new AvailableTimeSlotDTO(
                        slotDateTime,
                        slotEndDateTime,
                        appointmentDuration
                ));
            }

            current = current.plusMinutes(30); // 30-minute intervals
        }

        return availableSlots;
    }

    /**
     * Check if doctor has time off on a specific date using TimeOffRepository
     */
    private boolean isDoctorOnTimeOff(EmployeeEntity doctor, LocalDate date) {
        try {
            return timeOffRepository.hasTimeOffOnDate(doctor, date);
        } catch (Exception e) {
            log.warn("Error checking time off for doctor {}: {}", doctor.getEmail(), e.getMessage());
            return false; // Assume no time off if we can't check
        }
    }

    /**
     * Get time off periods for a doctor within a date range using TimeOffRepository
     */
    private List<TimeOff> getTimeOffInRange(EmployeeEntity doctor, LocalDate startDate, LocalDate endDate) {
        try {
            LocalDateTime startDateTime = startDate.atStartOfDay();
            LocalDateTime endDateTime = endDate.atTime(23, 59, 59);

            return timeOffRepository.findEmployeeTimeOffsInRange(doctor, startDateTime, endDateTime);
        } catch (Exception e) {
            log.warn("Error getting time off for doctor {}: {}", doctor.getEmail(), e.getMessage());
            return Collections.emptyList();
        }
    }

    private AppointmentDTO mapToAppointmentDTO(AppointmentEntity appointment) {
        return AppointmentDTO.builder()
                .id(appointment.getId())
                .doctorName(appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName())
                .patientName(appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName())
                .startDateTime(appointment.getStartDateTime())
                .endDateTime(appointment.getEndDateTime())
                .duration(appointment.getDurationInMins())
                .status(appointment.getStatus())
                .isDone(appointment.isDone())
                .build();
    }

    private ScheduleDTO mapToScheduleDTO(ScheduleEntity schedule) {
        return new ScheduleDTO(
                schedule.getDayOfWeek().toString(),
                schedule.getStartTime(),
                schedule.getEndTime()
        );
    }

    private TimeOffDTO mapToTimeOffDTO(TimeOff timeOff) {
        return TimeOffDTO.builder()
                .id(timeOff.getId())
                .startDateTime(timeOff.getStartDateTime())
                .endDateTime(timeOff.getEndDateTime())
                .reason(timeOff.getReason())
                .build();
    }
}