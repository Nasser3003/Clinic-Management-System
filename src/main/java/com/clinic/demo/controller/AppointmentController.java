package com.clinic.demo.controller;

import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.TreatmentsDTO;
import com.clinic.demo.service.AppointmentService;
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
    public ResponseEntity<String> scheduleAppointment(
            @RequestBody AppointmentRequestDTO requestDTO) {
        return appointmentService.scheduleAppointment(requestDTO.doctorEmail(), requestDTO.patientEmail(), requestDTO.dateTime());
    }
    @PostMapping("/cancel")
    public ResponseEntity<String> cancelAppointment(
            @RequestBody AppointmentRequestDTO requestDTO) {
        return appointmentService.cancelAppointment(requestDTO.doctorEmail(), requestDTO.patientEmail(), requestDTO.dateTime());
    }

    @PostMapping("mark-done")
    public ResponseEntity<String> markAppointmentAsDone(@RequestBody TreatmentsDTO treatmentsDTO) {
        return appointmentService.markAppointmentAsDone(treatmentsDTO);
    }
//    @PostMapping("mark-not-done")
//    public ResponseEntity<String> markAppointmentAsNotDone(@RequestBody TreatmentsDTO treatmentsDTO) {
//        // Implementation
//    }
}
