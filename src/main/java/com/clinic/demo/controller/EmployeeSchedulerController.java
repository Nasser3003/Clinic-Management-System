package com.clinic.demo.controller;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import com.clinic.demo.DTO.calenderDTO.CreateScheduleRequestDTO;
import com.clinic.demo.service.ScheduleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/schedules")
@CrossOrigin("*") // will need in the future
public class EmployeeSchedulerController {

    private final ScheduleService scheduleService;

    @GetMapping("/get-schedule")
    public ResponseEntity<Set<ScheduleSlotDTO>> getEmployeeSchedule(@RequestParam(required = false) String email) {
        Set<ScheduleSlotDTO>  scheduleSlotDTOList = scheduleService.getEmployeeSchedule(email);
        return ResponseEntity.ok(scheduleSlotDTOList);
    }

    @PostMapping("/create-schedule")
    public ResponseEntity<String> createEmployeeSchedule(@Valid @RequestBody CreateScheduleRequestDTO request) {
        scheduleService.createEmployeeSchedule(request.email(), request.schedule());
        return ResponseEntity.ok("Schedule created successfully");
    }

    @PatchMapping("/update-schedule")
    public ResponseEntity<String> updateEmployeeSchedule(@Valid @RequestBody CreateScheduleRequestDTO request) {
        scheduleService.updateEmployeeSchedule(request.email(), request.schedule());
        return ResponseEntity.ok("Schedule updated successfully");
    }

//     should have special permission
//    @DeleteMapping("/delete-schedule")
//    public ResponseEntity<String> deleteEmployeeSchedule(@RequestParam String email) {
//        scheduleService.deleteEmployeeSchedule(email);
//        return ResponseEntity.ok("Schedule deleted successfully");
//    }

}
