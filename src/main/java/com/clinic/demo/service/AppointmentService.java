package com.clinic.demo.service;

import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.FinalizingAppointmentDTO;
import com.clinic.demo.exception.LocalDateTimeException;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.repository.AppointmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserValidationService userValidationService;
    private final TreatmentService treatmentService;

    public void scheduleAppointment(AppointmentRequestDTO requestDTO) {
        String doctorEmail = requestDTO.doctorEmail();
        String patientEmail = requestDTO.patientEmail();
        LocalDateTime dateTime = requestDTO.dateTime();

        if (dateTime == null) throw new IllegalArgumentException("Appointment date and time must not be null");

        appointmentDateTimeLimitations(dateTime);

        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);
        PatientEntity patient = userValidationService.validateAndGetPatient(patientEmail);

        AppointmentEntity newAppointment = new AppointmentEntity(doctor, patient, dateTime);
        appointmentRepository.save(newAppointment);
    }

    public void cancelAppointment(String appointmentId) {
        AppointmentEntity appointment = findAppointmentById(appointmentId);
        appointmentRepository.delete(appointment);
    }

    @Transactional
    public void completeAppointment(String appointmentId, FinalizingAppointmentDTO finalizingAppointmentDTO) {
        AppointmentEntity appointment = findAppointmentById(appointmentId);

        treatmentService.createTreatmentsForAppointment(finalizingAppointmentDTO.treatments(), appointment);

        appointment.setStatus("done");
        appointmentRepository.save(appointment);
    }

    private AppointmentEntity findAppointmentById(String appointmentId) {
        return appointmentRepository.findById(UUID.fromString(appointmentId))
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
    }

    private void appointmentDateTimeLimitations(LocalDateTime dateTime) {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        if (dateTime.isBefore(tomorrow))
            throw new LocalDateTimeException("Cannot schedule/cancel appointment less than 24 hours in advance");
    }
}