package com.clinic.demo.controller;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import com.clinic.demo.service.ScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/schedules")
@CrossOrigin("*") // will need in the future
public class EmployeeSchedulerController {

    private final ScheduleService scheduleService;

    // TODO finish the employeeScheduleService methods
    @PostMapping("/create-schedule")
    public ResponseEntity<String> createEmployeeSchedule(String email, List<ScheduleSlotDTO> schedule) {
        scheduleService.createEmployeeSchedule(email, schedule);
        return ResponseEntity.ok("Schedule created successfully");
    }
    @PatchMapping("/update-schedule")
    public ResponseEntity<String> updateEmployeeSchedule(String email, List<ScheduleSlotDTO> schedule) {
        scheduleService.updateEmployeeSchedule(email, schedule);
        return ResponseEntity.ok("Schedule updated successfully");
    }
    public ResponseEntity<String> deleteEmployeeSchedule(String email) {
        scheduleService.deleteEmployeeSchedule(email);
        return ResponseEntity.ok("Schedule deleted successfully");
    }
    public ResponseEntity<String> getEmployeeSchedule(String email) {
        Set<ScheduleSlotDTO> scheduleSlotDTOList = scheduleService.getEmployeeSchedule(email);
        return ResponseEntity.ok("Schedule retrieved successfully");
    }


}
