package com.clinic.demo.controller;

import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.FinalizingAppointmentDTO;
import com.clinic.demo.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/appointments")
@CrossOrigin("*") // will need in the future
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping("/schedule")
    public ResponseEntity<String> scheduleAppointment(@Valid @RequestBody AppointmentRequestDTO requestDTO) {
        appointmentService.scheduleAppointment(requestDTO);
        return ResponseEntity.ok("Appointment scheduled successfully");
    }
    @PostMapping("/cancel")
    public ResponseEntity<String> cancelAppointment(String uuid) {
        appointmentService.cancelAppointment(uuid);
        return ResponseEntity.ok("Appointment cancelled successfully");
    }

    @PatchMapping("/{appointmentId}/complete")
    public ResponseEntity<String> completeAppointment(@PathVariable String appointmentId, @RequestBody FinalizingAppointmentDTO finalizingAppointmentDTO) {
        appointmentService.completeAppointment(appointmentId, finalizingAppointmentDTO);
        return ResponseEntity.ok("Appointment completed successfully");
    }


}
