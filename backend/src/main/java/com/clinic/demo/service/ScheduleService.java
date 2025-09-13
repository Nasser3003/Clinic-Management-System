package com.clinic.demo.service;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import com.clinic.demo.models.entity.ScheduleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.repository.ScheduleRepository;
import com.clinic.demo.utils.Validations;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final UserService userService;

    public void createEmployeeSchedule(String email,
                                       List<ScheduleSlotDTO> scheduleSlots) {
        BaseUserEntity employee = userService.findUserByEmail(email);
        if (!Validations.isInstanceOfEmployee(employee))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        var schedules = new HashSet<ScheduleEntity>();

        for (ScheduleSlotDTO slot : scheduleSlots) {
            if (slot.endTime().isBefore(slot.startTime()) || slot.endTime().equals(slot.startTime()))
                throw new IllegalArgumentException("End time cannot be before start time for day: " + slot.dayOfWeek());

            DayOfWeek dayOfWeek = DayOfWeek.valueOf(slot.dayOfWeek().toUpperCase());

            ScheduleEntity scheduleEntity = new ScheduleEntity(
                    (EmployeeEntity) employee,
                    dayOfWeek,
                    slot.startTime(),
                    slot.endTime()
            );
            schedules.add(scheduleEntity);
        }
        scheduleRepository.saveAll(schedules);
    }

    public void updateEmployeeSchedule(String email, List<ScheduleSlotDTO> schedule) {
        BaseUserEntity employee = userService.findUserByEmail(email);
        if (!Validations.isInstanceOfEmployee(employee))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        for (ScheduleSlotDTO scheduleSlotDTO : schedule) {
            ScheduleEntity scheduleEntity = scheduleRepository.findScheduleByEmployeeAndDayOfWeek(
                    (EmployeeEntity) employee,
                    DayOfWeek.valueOf(scheduleSlotDTO.dayOfWeek().toUpperCase())).orElseThrow(() -> new IllegalArgumentException("Schedule not found for employee: " + email + " and day: " + scheduleSlotDTO.dayOfWeek()));
            scheduleEntity.setStartTime(scheduleSlotDTO.startTime());
            scheduleEntity.setEndTime(scheduleSlotDTO.endTime());
            scheduleRepository.save(scheduleEntity);

        }
    }

    public void deleteEmployeeSchedule(String email) {
        BaseUserEntity employee = userService.findUserByEmail(email);
        if (!Validations.isInstanceOfEmployee(employee))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");
        scheduleRepository.deleteAll(scheduleRepository.findScheduleByEmployee((EmployeeEntity) employee));
    }

    public Set<ScheduleSlotDTO> getEmployeeSchedule(String email) {
        BaseUserEntity currentUser = userService.findUserByEmail(getCurrentUserEmail());
        BaseUserEntity targetEmployee;

        if (email == null || email.isBlank())
            targetEmployee = currentUser;
        else
            targetEmployee = userService.findUserByEmail(email);

        if (!Validations.isInstanceOfEmployee(currentUser))
            throw new IllegalArgumentException("Only employees can view schedules");

        if (!Validations.isInstanceOfEmployee(targetEmployee))
            throw new IllegalArgumentException("Target User is not an employee");

        return scheduleRepository.findScheduleByEmployee((EmployeeEntity) targetEmployee)
                .stream()
                .map(entity -> new ScheduleSlotDTO(
                        entity.getDayOfWeek().name(),
                        entity.getStartTime(),
                        entity.getEndTime()))
                .collect(Collectors.toSet());
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication.getName();
    }
}