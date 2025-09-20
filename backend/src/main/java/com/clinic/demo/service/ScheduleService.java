package com.clinic.demo.service;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import com.clinic.demo.models.entity.ScheduleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.ScheduleRepository;
import com.clinic.demo.utils.Validations;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserService userService;

    @Transactional
    public void createEmployeeSchedule(String email, List<ScheduleSlotDTO> scheduleSlots) {
        BaseUserEntity employee = userService.findUserByEmail(email);

        EnumSet<UserTypeEnum> allowed = EnumSet.of(
                UserTypeEnum.DOCTOR,
                UserTypeEnum.EMPLOYEE,
                UserTypeEnum.RECEPTIONIST,
                UserTypeEnum.NURSE,
                UserTypeEnum.LAB_TECHNICIAN
        );
        if (!allowed.contains(employee.getUserType()))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        EmployeeEntity employeeEntity = (EmployeeEntity) employee;

        // Always delete all existing schedules first
        deleteEmployeeSchedule(email);

        // If empty list is provided, we're done (schedules deleted above)
        if (scheduleSlots == null || scheduleSlots.isEmpty())
            return;

        // Validate and create new schedule
        validateScheduleSlots(scheduleSlots);

        List<ScheduleEntity> newSchedules = scheduleSlots.stream()
                .map(slot -> {
                    validateTimeSlot(slot);
                    return new ScheduleEntity(
                            employeeEntity,
                            DayOfWeek.valueOf(slot.dayOfWeek().toUpperCase()),
                            slot.startTime(),
                            slot.endTime()
                    );
                })
                .collect(Collectors.toList());

        scheduleRepository.saveAll(newSchedules);
    }

    @Transactional
    public void updateEmployeeScheduleForDay(String email, String dayOfWeek, List<ScheduleSlotDTO> dayScheduleSlots) {
        BaseUserEntity employee = userService.findUserByEmail(email);
        if (!Validations.isInstanceOfEmployee(employee))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        EmployeeEntity employeeEntity = (EmployeeEntity) employee;
        DayOfWeek day = DayOfWeek.valueOf(dayOfWeek.toUpperCase());

        // Validate that all slots are for the specified day
        if (dayScheduleSlots != null) {
            for (ScheduleSlotDTO slot : dayScheduleSlots) {
                if (!slot.dayOfWeek().equalsIgnoreCase(dayOfWeek))
                    throw new IllegalArgumentException("All schedule slots must be for the specified day: " + dayOfWeek);
            }
            validateScheduleSlots(dayScheduleSlots);
        }

        // Delete existing schedules for this day
        List<ScheduleEntity> existingDaySchedules = scheduleRepository.findByEmployee(employeeEntity)
                .stream()
                .filter(schedule -> schedule.getDayOfWeek().equals(day))
                .collect(Collectors.toList());

        if (!existingDaySchedules.isEmpty())
            scheduleRepository.deleteAll(existingDaySchedules);

        // If new slots provided, create them
        if (dayScheduleSlots != null && !dayScheduleSlots.isEmpty()) {
            List<ScheduleEntity> newSchedules = dayScheduleSlots.stream()
                    .map(slot -> {
                        validateTimeSlot(slot);
                        return new ScheduleEntity(
                                employeeEntity,
                                day,
                                slot.startTime(),
                                slot.endTime()
                        );
                    })
                    .collect(Collectors.toList());

            scheduleRepository.saveAll(newSchedules);
        }
    }

    @Transactional
    public void deleteEmployeeSchedule(String email) {
        BaseUserEntity employee = userService.findUserByEmail(email);
        if (!Validations.isInstanceOfEmployee(employee))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        int deletedCount = scheduleRepository.deleteByEmployee((EmployeeEntity) employee);
        scheduleRepository.flush();
    }

    @Transactional
    public void deleteEmployeeScheduleForDay(String email, String dayOfWeek) {
        BaseUserEntity employee = userService.findUserByEmail(email);
        if (!Validations.isInstanceOfEmployee(employee))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        DayOfWeek day = DayOfWeek.valueOf(dayOfWeek.toUpperCase());
        List<ScheduleEntity> daySchedules = scheduleRepository.findByEmployee((EmployeeEntity) employee)
                .stream()
                .filter(schedule -> schedule.getDayOfWeek().equals(day))
                .collect(Collectors.toList());

        if (!daySchedules.isEmpty())
            scheduleRepository.deleteAll(daySchedules);
    }

    public Set<ScheduleSlotDTO> getEmployeeSchedule(String email) {
        BaseUserEntity currentUser = userService.findUserById(getCurrentUserid());
        BaseUserEntity targetEmployee;

        if (email == null || email.isBlank())
            targetEmployee = currentUser;
        else
            targetEmployee = userService.findUserByEmail(email);

        if (!Validations.isInstanceOfEmployee(currentUser) && !currentUser.getUserType().equals(UserTypeEnum.ADMIN))
            throw new IllegalArgumentException("Only employees can view schedules");

        if (!Validations.isInstanceOfEmployee(targetEmployee))
            throw new IllegalArgumentException("Target User is not an employee");

        return scheduleRepository.findByEmployee((EmployeeEntity) targetEmployee)
                .stream()
                .map(entity -> new ScheduleSlotDTO(
                        entity.getDayOfWeek().name(),
                        entity.getStartTime(),
                        entity.getEndTime()))
                .collect(Collectors.toSet());
    }

    public Map<String, List<ScheduleSlotDTO>> getEmployeeScheduleGroupedByDay(String email) {
        Set<ScheduleSlotDTO> schedules = getEmployeeSchedule(email);

        return schedules.stream()
                .collect(Collectors.groupingBy(
                        ScheduleSlotDTO::dayOfWeek,
                        LinkedHashMap::new, // Preserve insertion order
                        Collectors.toList()
                ))
                .entrySet()
                .stream()
                .sorted(Map.Entry.comparingByKey((day1, day2) -> {
                    // Sort by day of week order
                    DayOfWeek dow1 = DayOfWeek.valueOf(day1.toUpperCase());
                    DayOfWeek dow2 = DayOfWeek.valueOf(day2.toUpperCase());
                    return dow1.compareTo(dow2);
                }))
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        entry -> entry.getValue().stream()
                                .sorted(Comparator.comparing(ScheduleSlotDTO::startTime))
                                .collect(Collectors.toList()),
                        (e1, e2) -> e1,
                        LinkedHashMap::new
                ));
    }

    private void validateTimeSlot(ScheduleSlotDTO slot) {
        if (slot.endTime().isBefore(slot.startTime()) || slot.endTime().equals(slot.startTime()))
            throw new IllegalArgumentException("End time must be after start time for day: " + slot.dayOfWeek());
    }

    private void validateScheduleSlots(List<ScheduleSlotDTO> scheduleSlots) {
        // Group slots by day and check for overlaps within each day
        Map<String, List<ScheduleSlotDTO>> slotsByDay = scheduleSlots.stream()
                .collect(Collectors.groupingBy(ScheduleSlotDTO::dayOfWeek));

        for (Map.Entry<String, List<ScheduleSlotDTO>> entry : slotsByDay.entrySet()) {
            String day = entry.getKey();
            List<ScheduleSlotDTO> daySlots = entry.getValue();

            if (daySlots.size() > 3)
                throw new IllegalArgumentException("Maximum 3 shifts allowed per day for " + day);

            // Sort slots by start time for overlap checking
            daySlots.sort(Comparator.comparing(ScheduleSlotDTO::startTime));

            // Check for overlaps
            for (int i = 0; i < daySlots.size() - 1; i++) {
                ScheduleSlotDTO current = daySlots.get(i);
                ScheduleSlotDTO next = daySlots.get(i + 1);

                if (current.endTime().isAfter(next.startTime()))
                    throw new IllegalArgumentException(
                            String.format("Overlapping shifts found for %s: %s-%s overlaps with %s-%s",
                                    day, current.startTime(), current.endTime(),
                                    next.startTime(), next.endTime()));
            }
        }
    }

    private String getCurrentUserid() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}