package com.clinic.demo.service;

import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.TreatmentDetails;
import com.clinic.demo.DTO.FinalizingAppointmentDTO;
import com.clinic.demo.exception.LocalDateTimeException;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.AppointmentRepository;
import com.clinic.demo.repository.TreatmentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Service
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserService userService;
    private final TreatmentRepository treatmentRepository;

    public void scheduleAppointment(AppointmentRequestDTO requestDTO) {
        String doctorEmail = requestDTO.doctorEmail();
        String patientEmail = requestDTO.patientEmail();
        LocalDateTime dateTime = requestDTO.dateTime();

        validateUsers(doctorEmail, patientEmail);

        if (dateTime == null) throw new IllegalArgumentException("Appointment date and time must not be null");
        appointmentDateTimeLimitations(dateTime);

        EmployeeEntity doctor = getUserAsEmployee(doctorEmail);
        PatientEntity patient = getUserAsPatient(patientEmail);

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
        List<TreatmentDetails> allTreatments = finalizingAppointmentDTO.treatments();
        if (allTreatments == null || allTreatments.isEmpty())
            throw new IllegalArgumentException("Treatments list must not be null or empty");

        saveTreatments(finalizingAppointmentDTO.treatments(), appointment);
        appointment.setStatus("done");
        appointmentRepository.save(appointment);
    }

    private void saveTreatments(List<TreatmentDetails> allTreatments, AppointmentEntity appointment) {
        allTreatments.stream()
                .map(treatmentDetail -> createTreatmentEntity(treatmentDetail, appointment.getDoctor(), appointment.getPatient(), appointment))
                .forEach(treatmentRepository::save);
    }

    private TreatmentEntity createTreatmentEntity(TreatmentDetails treatmentDetail, EmployeeEntity doctor, PatientEntity patient, AppointmentEntity appointment) {
        int cost = treatmentDetail.cost();
        int amountPaid = treatmentDetail.amountPaid();
        int remainingBalance = cost - amountPaid;
        int installmentPeriodInMonths = treatmentDetail.installmentPeriodInMonths();
        String treatmentDescription = TreatmentEntity.getTreatmentFromMap(treatmentDetail.treatmentId());

        return new TreatmentEntity(
                doctor,
                patient,
                appointment,
                treatmentDescription,
                cost,
                amountPaid,
                installmentPeriodInMonths,
                remainingBalance
        );
    }

    private AppointmentEntity findAppointmentById(String appointmentId) {
        return appointmentRepository.findById(UUID.fromString(appointmentId))
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
    }

    private void appointmentDateTimeLimitations(LocalDateTime dateTime) {
        LocalDateTime tomorrow = LocalDateTime.now().plusDays(1);
        if (dateTime.isBefore(tomorrow)) {
            throw new LocalDateTimeException("Cannot schedule/cancel appointment less than 24 hours in advance");
        }
    }

    private void validateUsers(String doctorEmail, String patientEmail) {
        // Validate email parameters
        if (doctorEmail == null) throw new IllegalArgumentException("Doctor email must not be null");
        if (patientEmail == null) throw new IllegalArgumentException("Patient email must not be null");

        // Retrieve and validate user entities
        BaseUserEntity doctor = userService.selectUserByEmail(doctorEmail);
        BaseUserEntity patient = userService.selectUserByEmail(patientEmail);

        if (doctor == null) throw new EntityNotFoundException("Doctor not found with email: " + doctorEmail);
        if (patient == null) throw new EntityNotFoundException("Patient not found with email: " + patientEmail);

        // Validate user types
        if (doctor.getUserType() != UserTypeEnum.DOCTOR && doctor.getUserType() != UserTypeEnum.EMPLOYEE)
            throw new IllegalArgumentException("User with email " + doctorEmail + " is not a doctor or employee");

        if (patient.getUserType() != UserTypeEnum.PATIENT)
            throw new IllegalArgumentException("User with email " + patientEmail + " is not a patient");
    }

    private EmployeeEntity getUserAsEmployee(String email) {
        BaseUserEntity user = userService.selectUserByEmail(email);
        if (user instanceof EmployeeEntity) return (EmployeeEntity) user;
        throw new IllegalArgumentException("User with email " + email + " is not an employee");
    }

    private PatientEntity getUserAsPatient(String email) {
        BaseUserEntity user = userService.selectUserByEmail(email);
        if (user instanceof PatientEntity) {
            return (PatientEntity) user;
        }
        throw new IllegalArgumentException("User with email " + email + " is not a patient");
    }
}