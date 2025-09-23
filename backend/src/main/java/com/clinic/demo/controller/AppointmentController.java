package com.clinic.demo.controller;

import com.clinic.demo.DTO.AppSearchStatusInBetweenDTO;
import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.FinalizingAppointmentDTO;
import com.clinic.demo.DTO.calenderDTO.AppointmentDTO;
import com.clinic.demo.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @PatchMapping(value = "/{appointmentId}/complete", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<String> completeAppointment(
            @PathVariable String appointmentId,
            @RequestPart("data") FinalizingAppointmentDTO finalizingAppointmentDTO,
            @RequestPart(value = "files", required = false) List<MultipartFile> files) throws IOException {

        appointmentService.completeAppointment(appointmentId, finalizingAppointmentDTO, files);
        return ResponseEntity.ok("Appointment completed successfully");
    }

    @GetMapping("/all")
    public List<AppointmentDTO> getAllAppointments() {
        return appointmentService.getAllAppointments();
    }

    // Changed to POST with @RequestBody since you're sending complex search criteria
    @PostMapping("/search")
    public List<AppointmentDTO> searchAppointments(@RequestBody AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @PostMapping("/search/doctor")
    public List<AppointmentDTO> getAppointmentsByDoctorStatusAndIsBetween(@RequestBody AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @PostMapping("/search/patient")
    public List<AppointmentDTO> getAppointmentsByPatientStatusAndIsBetween(@RequestBody AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @PostMapping("/search/doctor-and-patient")
    public List<AppointmentDTO> getAppointmentsByPatientAndDoctorStatusAndIsBetween(@RequestBody AppSearchStatusInBetweenDTO dto) {
        return appointmentService.searchAppointments(dto);
    }

    @PostMapping("/search/doctor-patient/scheduled")
    public List<AppointmentDTO> getTreatmentDoctorPatientEmailScheduled(@RequestBody AppSearchStatusInBetweenDTO dto) {
        return appointmentService.getTreatmentDoctorPatientEmailScheduled(dto);
    }
}