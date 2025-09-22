package com.clinic.demo.controller;

import com.clinic.demo.DTO.AppSearchStatusInBetweenDTO;
import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.FinalizingAppointmentDTO;
import com.clinic.demo.DTO.calenderDTO.AppointmentDTO;
import com.clinic.demo.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
@CrossOrigin("*")
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/schedule")
    public ResponseEntity<String> scheduleAppointment(@Valid @RequestBody AppointmentRequestDTO requestDTO) {
        appointmentService.scheduleAppointment(requestDTO);
        return ResponseEntity.ok("Appointment scheduled successfully");
    }

    @PostMapping("/cancel")
    public ResponseEntity<String> cancelAppointment(@RequestParam String uuid) {
        appointmentService.cancelAppointment(uuid);
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @PatchMapping("/{appointmentId}/complete")
    public ResponseEntity<String> completeAppointment(@PathVariable String appointmentId, @RequestBody FinalizingAppointmentDTO finalizingAppointmentDTO) {
        appointmentService.completeAppointment(appointmentId, finalizingAppointmentDTO);
        return ResponseEntity.ok("Appointment completed successfully");
    }

    @GetMapping("/all")
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    @GetMapping("/search")
    public List<AppointmentDTO> searchAppointments(AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @GetMapping("/search/doctor")
    public List<AppointmentDTO> getAppointmentsByDoctorStatusAndIsBetween(AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @GetMapping("/search/patient")
    public List<AppointmentDTO> getAppointmentsByPatientStatusAndIsBetween(AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @GetMapping("/search/doctor-and-patient")
    public List<AppointmentDTO> getAppointmentsByPatientAndDoctorStatusAndIsBetween(AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }
}