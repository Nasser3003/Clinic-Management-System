package com.clinic.demo.service;

import com.clinic.demo.exception.LocalDateTimeException;
import com.clinic.demo.models.entitiy.AppointmentEntity;
import com.clinic.demo.models.entitiy.user.DoctorEntity;
import com.clinic.demo.models.entitiy.user.PatientEntity;
import com.clinic.demo.repository.AppointmentRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Optional;

@AllArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;

    public ResponseEntity<String> scheduleAppointment(String doctorEmail,
                                                      String patientEmail,
                                                      LocalDateTime dateTime) {
        validateInput(doctorEmail, patientEmail, dateTime);
        appointmentDateTimeLimitations(dateTime);

        DoctorEntity doctor = (DoctorEntity) userService.selectUserByEmail(doctorEmail);
        PatientEntity patient = (PatientEntity) userService.selectUserByEmail(patientEmail);

        AppointmentEntity newAppointment = new AppointmentEntity(doctor, patient, dateTime);
        appointmentRepository.save(newAppointment);
        return ResponseEntity.ok("Appointment Scheduled.");
    }

    public ResponseEntity<String> cancelAppointment(String doctorEmail,
                                                      String patientEmail,
                                                      LocalDateTime dateTime) {
        validateInput(doctorEmail, patientEmail, dateTime);
        appointmentDateTimeLimitations(dateTime);

        DoctorEntity doctor = (DoctorEntity) userService.selectUserByEmail(doctorEmail);
        PatientEntity patient = (PatientEntity) userService.selectUserByEmail(patientEmail);

        Optional<AppointmentEntity> appointment = appointmentRepository.findByScheduleDateTimeAndPatientAndDoctor(dateTime, patient, doctor);
        AppointmentEntity appointmentEntity = appointment.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "No appointment found for the specified criteria"));
        try {
            appointmentRepository.delete(appointmentEntity);
            return ResponseEntity.ok("Appointment canceled successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to cancel the appointment.");
        }
    }
    private void appointmentDateTimeLimitations(LocalDateTime dateTime) {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        if (dateTime.isBefore(tomorrow))
            throw new LocalDateTimeException("cannot cancel tomorrow appointment");
    }
    private void validateInput(String doctorEmail, String patientEmail, LocalDateTime dateTime) {
        Objects.requireNonNull(doctorEmail, "doctorEmail must not be null");
        Objects.requireNonNull(patientEmail, "patientEmail must not be null");
        Objects.requireNonNull(dateTime, "date must not be null");

        try {
            DoctorEntity doctor = (DoctorEntity) userService.selectUserByEmail(doctorEmail);
            PatientEntity patient = (PatientEntity) userService.selectUserByEmail(patientEmail);
        } catch (ClassCastException e) {
            throw new RuntimeException("Issue in AppointmentService, validateInput TypeCast", e);
        }
    }
}
