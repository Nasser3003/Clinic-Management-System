package com.clinic.demo.service;

import com.clinic.demo.DTO.AppSearchStatusInBetweenDTO;
import com.clinic.demo.DTO.AppointmentRequestDTO;
import com.clinic.demo.DTO.FinalizingAppointmentDTO;
import com.clinic.demo.DTO.calenderDTO.AppointmentDTO;
import com.clinic.demo.Mapper.AppointmentMapper;
import com.clinic.demo.exception.LocalDateTimeException;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.AppointmentStatus;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.AppointmentRepository;
import com.clinic.demo.repository.ScheduleRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final UserValidationService userValidationService;
    private final TreatmentService treatmentService;
    private final ScheduleRepository scheduleRepository;
    private final FileUploadService fileUploadService;

    @Value("${appointment.min.hours.in.advance:24}")
    private int minHoursInAdvance;

    @Value("${appointment.max.months.in.advance:6}")
    private int maxMonthsInAdvance;

    public void scheduleAppointment(AppointmentRequestDTO requestDTO) {
        String doctorEmail = requestDTO.doctorEmail();
        String patientEmail = requestDTO.patientEmail();
        int duration = requestDTO.duration();
        LocalDateTime dateTime = requestDTO.dateTime();

        if (dateTime == null)
            throw new IllegalArgumentException("Appointment date and time must not be null");

        appointmentDateTimeLimitations(dateTime);

        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);
        PatientEntity patient = userValidationService.validateAndGetPatient(patientEmail);

        if (patientHasOpenAppointment(patient))
            throw new IllegalArgumentException("Patient with email " + patientEmail + " already has an open appointment");

        if (!isDoctorWorking(doctor, dateTime))
            throw new IllegalArgumentException("Doctor is not working on " + dateTime);

        if (!isDoctorAvailable(doctor, dateTime, duration))
            throw new IllegalArgumentException("Doctor is not available at the requested time");

        AppointmentEntity newAppointment = new AppointmentEntity(doctor, patient, dateTime, duration, requestDTO.reason());
        appointmentRepository.save(newAppointment);
    }

    public void cancelAppointment(String appointmentId) {
        AppointmentEntity appointment = findAppointmentById(appointmentId);
        appointment.setStatus(AppointmentStatus.CANCELED);
        appointmentRepository.save(appointment);
    }

    @Transactional
    public void completeAppointment(String appointmentId, FinalizingAppointmentDTO finalizingAppointmentDTO, List<MultipartFile> files) throws IOException {
        AppointmentEntity appointment = findAppointmentById(appointmentId);

        List<String> filePaths = fileUploadService.saveTreatmentFiles(files, appointment.getPatient().getEmail());

        FinalizingAppointmentDTO updatedDTO = new FinalizingAppointmentDTO(
                finalizingAppointmentDTO.treatments(),
                filePaths,
                finalizingAppointmentDTO.visitNotes()
        );

        treatmentService.createTreatmentsForAppointment(updatedDTO.treatments(), appointment);
        appointment.setStatus(AppointmentStatus.COMPLETED);
        appointmentRepository.save(appointment);
    }

    private AppointmentEntity findAppointmentById(String appointmentId) {
        return appointmentRepository.findById(UUID.fromString(appointmentId))
                .orElseThrow(() -> new EntityNotFoundException("Appointment not found with ID: " + appointmentId));
    }

    private void appointmentDateTimeLimitations(LocalDateTime dateTime) {
        LocalDateTime tomorrow = LocalDateTime.now().plusHours(minHoursInAdvance);
        if (dateTime.isBefore(tomorrow))
            throw new LocalDateTimeException("Cannot schedule appointment less than " + minHoursInAdvance + " hours in advance");

        LocalDateTime maxFutureDate = LocalDateTime.now().plusMonths(maxMonthsInAdvance);
        if (dateTime.isAfter(maxFutureDate))
            throw new LocalDateTimeException("Cannot schedule appointment more than " + maxMonthsInAdvance + " months in advance");
    }

    private boolean patientHasOpenAppointment(PatientEntity patient) {
        List<AppointmentEntity> allAppointments = appointmentRepository.findAllByPatient(patient);
        return allAppointments.stream()
                .anyMatch(appointment -> appointment.getStatus().equals(AppointmentStatus.SCHEDULED));
    }

    private boolean isDoctorWorking(EmployeeEntity employee, LocalDateTime dateTime) {
        if (employee.getUserType() != UserTypeEnum.DOCTOR)
            throw new IllegalArgumentException("User with email " + employee.getEmail() + " is not a doctor");

        return scheduleRepository.findScheduleByEmployee(employee).stream()
                .anyMatch(a -> a.getDayOfWeek().equals(dateTime.getDayOfWeek()));
    }

    private boolean isDoctorAvailable(EmployeeEntity employee, LocalDateTime startDateTime, int durationInMins) {
        if (employee.getUserType() != UserTypeEnum.DOCTOR)
            throw new IllegalArgumentException("User with email " + employee.getEmail() + " is not a doctor");

        LocalDateTime endDateTime = startDateTime.plusMinutes(durationInMins);
        List<AppointmentEntity> doctorAppointments = appointmentRepository
                .findByStatusAndDoctor_EmailAndStartDateTimeBetween(AppointmentStatus.SCHEDULED, employee.getEmail(), startDateTime, endDateTime);

        return doctorAppointments.stream()
                .noneMatch(appointment ->
                        startDateTime.isBefore(appointment.getEndDateTime()) &&
                                endDateTime.isAfter(appointment.getStartDateTime())
                );
    }

    public List<AppointmentDTO> searchAppointments(AppSearchStatusInBetweenDTO dto) {
        if (dto.patientEmail() != null && !dto.patientEmail().trim().isEmpty())
            userValidationService.validateAndGetPatient(dto.patientEmail());

        if (dto.doctorEmail() != null && !dto.doctorEmail().trim().isEmpty())
            userValidationService.validateAndGetDoctor(dto.doctorEmail());

        LocalDateTime startDateTime = dto.startDate();
        LocalDateTime endDateTime = dto.endDate();

        return appointmentRepository.findAppointmentsWithOptionalFilters(
                        dto.patientEmail(),
                        dto.doctorEmail(),
                        dto.statusEnum(),
                        startDateTime,
                        endDateTime)
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();
    }

    public List<AppointmentDTO> getTreatmentDoctorPatientEmailScheduled(AppSearchStatusInBetweenDTO dto) {
        String doctorEmail = dto.doctorEmail();
        String patientEmail = dto.patientEmail();
        return getTreatmentDoctorPatientEmailAndStatus(doctorEmail, patientEmail, AppointmentStatus.SCHEDULED);
    }

    public List<AppointmentDTO> findAllScheduledAppointments() {
        return findAllByStatus(AppointmentStatus.SCHEDULED);
    }

    private List<AppointmentDTO> getTreatmentDoctorPatientEmailAndStatus(String doctorEmail, String patientEmail,
                                                                         AppointmentStatus status) {
        return appointmentRepository
                .findByDoctorEmailAndPatientEmailAndStatus(doctorEmail, patientEmail, status)
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll().stream().map(AppointmentMapper::toDTO).toList();
    }

    public List<AppointmentEntity> findAllAppointmentsByPatient(String patientEmail) {
        PatientEntity patient = userValidationService.validateAndGetPatient(patientEmail);
        return appointmentRepository.findAllByPatient(patient);
    }

    public List<AppointmentEntity> findAllAppointmentsByDoctor(String doctorEmail) {
        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(doctorEmail);
        return appointmentRepository.findAllByDoctor(doctor);
    }

    private List<AppointmentDTO> findAllByStatus(AppointmentStatus status) {
        return appointmentRepository
                .findAllByStatus(status)
                .stream()
                .map(AppointmentMapper::toDTO)
                .toList();
    }
}