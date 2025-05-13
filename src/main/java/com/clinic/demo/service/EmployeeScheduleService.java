package com.clinic.demo.service;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import com.clinic.demo.models.entity.Schedule;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class EmployeeScheduleService {

    private final ScheduleRepository scheduleRepository;

    public Set<Schedule> createEmployeeSchedule(EmployeeEntity employee,
                                                 List<ScheduleSlotDTO> scheduleSlots) {

        var schedules = new HashSet<Schedule>();

        for (ScheduleSlotDTO slot : scheduleSlots) {
            // Validate time range
            if (slot.endTime().isBefore(slot.startTime()) || slot.endTime().equals(slot.startTime()))
                throw new IllegalArgumentException("End time cannot be before start time for day: " + slot.dayOfWeek());

            DayOfWeek dayOfWeek = DayOfWeek.valueOf(slot.dayOfWeek().toUpperCase());

            Schedule schedule = new Schedule(
                    employee,
                    dayOfWeek,
                    slot.startTime(),
                    slot.endTime()
            );
            schedules.add(schedule);
            scheduleRepository.saveAll(schedules);
        }

        return schedules;
    }
}