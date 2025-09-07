package com.clinic.demo.controller;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import com.clinic.demo.service.ScheduleService;
import jakarta.validation.Valid;
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

    @PostMapping("/create-schedule")
    public ResponseEntity<String> createEmployeeSchedule(@RequestParam String email, @Valid @RequestBody List<ScheduleSlotDTO> schedule) {
        scheduleService.createEmployeeSchedule(email, schedule);
        return ResponseEntity.ok("Schedule created successfully");
    }

    @PatchMapping("/update-schedule")
    public ResponseEntity<String> updateEmployeeSchedule(@RequestParam String email, @Valid @RequestBody List<ScheduleSlotDTO> schedule) {
        scheduleService.updateEmployeeSchedule(email, schedule);
        return ResponseEntity.ok("Schedule updated successfully");
    }

    @DeleteMapping("/delete-schedule")
    public ResponseEntity<String> deleteEmployeeSchedule(@RequestParam String email) {
        scheduleService.deleteEmployeeSchedule(email);
        return ResponseEntity.ok("Schedule deleted successfully");
    }

    @GetMapping("/get-schedule")
    public ResponseEntity<Set<ScheduleSlotDTO>> getEmployeeSchedule(@RequestParam(required = false) String email) {
        Set<ScheduleSlotDTO> scheduleSlotDTOList;
        scheduleSlotDTOList = scheduleService.getEmployeeSchedule(email);
        return ResponseEntity.ok(scheduleSlotDTOList);
    }


}
