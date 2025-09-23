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


    public List<AvailableTimeSlotDTO> getAvailableSlots(String doctorEmail, LocalDate date, int appointmentDuration) {
        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);

        Optional<ScheduleEntity> scheduleOpt = scheduleRepository
                .findByEmployeeAndDayOfWeek(doctor, date.getDayOfWeek());

        if (scheduleOpt.isEmpty())
            return Collections.emptyList();

        ScheduleEntity schedule = scheduleOpt.get();

        if (isDoctorOnTimeOff(doctor, date))
            return Collections.emptyList();

        List<AppointmentEntity> existingAppointments = findAppointmentsByDoctorAndDateRange(
                doctor,
                date.atTime(schedule.getStartTime()),
                date.atTime(schedule.getEndTime())
        );

        return generateAvailableSlots(schedule, existingAppointments, date, appointmentDuration);
    }

    public DoctorCalendarViewDTO getDoctorCalendarView(String doctorEmail, LocalDate startDate, LocalDate endDate) {
        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);

        List<AppointmentEntity> appointments = findAppointmentsByDoctorAndDateRange(
                doctor,
                startDate.atStartOfDay(),
                endDate.atTime(23, 59, 59)
        );

        List<ScheduleEntity> weeklySchedule = scheduleRepository.findByEmployee(doctor);

        List<TimeOff> timeOffPeriods = getTimeOffInRange(doctor, startDate, endDate);

        return new DoctorCalendarViewDTO(
                doctor.getFirstName() + " " + doctor.getLastName(),
                doctor.getEmail(),
                startDate,
                endDate,
                appointments.stream().map(this::mapToAppointmentDTO).collect(Collectors.toList()),
                weeklySchedule.stream().map(this::mapToScheduleDTO).collect(Collectors.toList()),
                timeOffPeriods.stream().map(this::mapToTimeOffDTO).collect(Collectors.toList())
        );
    }


    public PatientCalendarViewDTO getPatientCalendarView(String patientEmail, LocalDate startDate, LocalDate endDate) {
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


    private boolean isDoctorAvailableForAppointment(EmployeeEntity doctor, LocalDateTime dateTime, int duration) {
        try {
            if (!isDoctorWorkingLocal(doctor, dateTime))
                return false;
            return isDoctorAvailableLocal(doctor, dateTime, duration);
        } catch (Exception e) {
            log.warn("Error checking doctor availability for {}: {}", doctor.getEmail(), e.getMessage());
            return false;
        }
    }

    private boolean isDoctorAvailableLocal(EmployeeEntity doctor, LocalDateTime dateTime, int duration) {
        LocalDateTime endDateTime = dateTime.plusMinutes(duration);

        List<AppointmentEntity> doctorAppointments = appointmentRepository.findAllByDoctor(doctor);

        return doctorAppointments.stream()
                .noneMatch(apt -> {
                    return dateTime.isBefore(apt.getEndDateTime()) &&
                            endDateTime.isAfter(apt.getStartDateTime());
                });
    }


    private boolean isDoctorWorkingLocal(EmployeeEntity doctor, LocalDateTime dateTime) {
        LocalDate date = dateTime.toLocalDate();
        LocalTime time = dateTime.toLocalTime();

        if (isDoctorOnTimeOff(doctor, date))
            return false;

        Optional<ScheduleEntity> scheduleOpt = scheduleRepository
                .findByEmployeeAndDayOfWeek(doctor, date.getDayOfWeek());

        if (scheduleOpt.isEmpty())
            return false;

        ScheduleEntity schedule = scheduleOpt.get();
        return !time.isBefore(schedule.getStartTime()) && !time.isAfter(schedule.getEndTime());
    }

    private List<AppointmentEntity> findAppointmentsByDoctorAndDateRange(
            EmployeeEntity doctor, LocalDateTime start, LocalDateTime end) {

        List<AppointmentEntity> allDoctorAppointments = appointmentRepository.findAllByDoctor(doctor);

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


    private boolean isDoctorOnTimeOff(EmployeeEntity doctor, LocalDate date) {
        try {
            return timeOffRepository.hasTimeOffOnDate(doctor, date);
        } catch (Exception e) {
            log.warn("Error checking time off for doctor {}: {}", doctor.getEmail(), e.getMessage());
            return false; // Assume no time off if we can't check
        }
    }


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
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getDoctor().getFirstName() + " " + appointment.getDoctor().getLastName(),
                appointment.getPatient().getFirstName() + " " + appointment.getPatient().getLastName(),
                appointment.getStartDateTime(),
                appointment.getEndDateTime(),
                appointment.getDurationInMins(),
                appointment.getStatus(),
                appointment.getReason()
        );
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