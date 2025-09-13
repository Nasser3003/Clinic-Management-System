package com.clinic.demo.controller;

import com.clinic.demo.DTO.calenderDTO.TimeOffApprovalDTO;
import com.clinic.demo.DTO.calenderDTO.TimeOffDTO;
import com.clinic.demo.models.enums.TimeOffStatus;
import com.clinic.demo.service.TimeOffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/timeoffs")
@CrossOrigin("*")
public class TimeOffController {

    private final TimeOffService timeOffService;

    @PostMapping("/create")
    public ResponseEntity<TimeOffDTO> createTimeOff(
            @RequestParam String employeeEmail,
            @Valid @RequestBody TimeOffDTO timeOffDTO) {
        TimeOffDTO createdTimeOff = timeOffService.createTimeOff(employeeEmail, timeOffDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTimeOff);
    }

    @PutMapping("/{timeOffId}")
    public ResponseEntity<TimeOffDTO> updateTimeOff(
            @PathVariable Long timeOffId,
            @Valid @RequestBody TimeOffDTO timeOffDTO) {
        TimeOffDTO updatedTimeOff = timeOffService.updateTimeOff(timeOffId, timeOffDTO);
        return ResponseEntity.ok(updatedTimeOff);
    }

    @PutMapping("/{timeOffId}/status")
    public ResponseEntity<TimeOffDTO> updateTimeOffStatus(
            @PathVariable Long timeOffId,
            @RequestParam String adminEmail,
            @Valid @RequestBody TimeOffApprovalDTO approvalDTO) {
        TimeOffDTO updatedTimeOff = timeOffService.updateTimeOffStatus(timeOffId, approvalDTO, adminEmail);
        return ResponseEntity.ok(updatedTimeOff);
    }

    @DeleteMapping("/{timeOffId}")
    public ResponseEntity<String> deleteTimeOff(@PathVariable Long timeOffId) {
        timeOffService.deleteTimeOff(timeOffId);
        return ResponseEntity.ok("Time off deleted successfully");
    }

    @GetMapping("/employee")
    public ResponseEntity<List<TimeOffDTO>> getEmployeeTimeOffs(
            @RequestParam String employeeEmail) {
        List<TimeOffDTO> timeOffs = timeOffService.getEmployeeTimeOffs(employeeEmail);
        return ResponseEntity.ok(timeOffs);
    }

    @GetMapping("/employee/status")
    public ResponseEntity<List<TimeOffDTO>> getEmployeeTimeOffsByStatus(
            @RequestParam String employeeEmail,
            @RequestParam TimeOffStatus status) {
        List<TimeOffDTO> timeOffs = timeOffService.getEmployeeTimeOffsByStatus(employeeEmail, status);
        return ResponseEntity.ok(timeOffs);
    }

    @GetMapping("/employee/range")
    public ResponseEntity<List<TimeOffDTO>> getEmployeeTimeOffsInRange(
            @RequestParam String employeeEmail,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime startDateTime,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime endDateTime) {
        List<TimeOffDTO> timeOffs = timeOffService.getEmployeeTimeOffsInRange(employeeEmail, startDateTime, endDateTime);
        return ResponseEntity.ok(timeOffs);
    }

    @GetMapping("/employee/check")
    public ResponseEntity<Boolean> hasTimeOffOnDateTime(
            @RequestParam String employeeEmail,
            @RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd HH:mm:ss") LocalDateTime dateTime) {
        boolean hasTimeOff = timeOffService.hasTimeOffOnDateTime(employeeEmail, dateTime);
        return ResponseEntity.ok(hasTimeOff);
    }

    @GetMapping("/active")
    public ResponseEntity<List<TimeOffDTO>> getAllActiveTimeOffs() {
        List<TimeOffDTO> activeTimeOffs = timeOffService.getAllActiveTimeOffs();
        return ResponseEntity.ok(activeTimeOffs);
    }

    @GetMapping("/pending")
    public ResponseEntity<List<TimeOffDTO>> getPendingTimeOffs() {
        List<TimeOffDTO> pendingTimeOffs = timeOffService.getPendingTimeOffs();
        return ResponseEntity.ok(pendingTimeOffs);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<TimeOffDTO>> getTimeOffsByStatus(@PathVariable TimeOffStatus status) {
        List<TimeOffDTO> timeOffs = timeOffService.getTimeOffsByStatus(status);
        return ResponseEntity.ok(timeOffs);
    }
}
