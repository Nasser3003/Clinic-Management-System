package com.clinic.demo.service;

import com.clinic.demo.DTO.*;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.PrescriptionEntity;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.AppointmentStatus;
import com.clinic.demo.repository.PrescriptionRepository;
import com.clinic.demo.repository.TreatmentRepository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TreatmentService {
    private final TreatmentRepository treatmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final UserValidationService userValidationService;
    private final EntityManager entityManager;

    @Transactional
    public void createTreatmentsForAppointment(List<TreatmentDetailsDTO> treatmentDetailDTOS,
                                               AppointmentEntity appointment) {
        if (treatmentDetailDTOS == null || treatmentDetailDTOS.isEmpty())
            throw new IllegalArgumentException("Treatments list must not be null or empty");

        treatmentDetailDTOS.forEach(detail -> {
            TreatmentEntity treatment = createTreatmentEntity(
                    detail,
                    appointment.getDoctor(),
                    appointment.getPatient(),
                    detail.treatmentDescription(),
                    appointment);

            TreatmentEntity savedTreatment = treatmentRepository.save(treatment);

            if (detail.prescriptions() != null)
                detail.prescriptions().forEach(prescriptionDTO -> {
                    PrescriptionEntity prescription = createPrescriptionEntity(prescriptionDTO, savedTreatment);
                    prescriptionRepository.save(prescription);
                });
        });
    }

    @Transactional
    public void updateTreatment(UUID treatmentId, TreatmentUpdateDTO updateDTO) {
        if (!updateDTO.hasAnyUpdate())
            throw new IllegalArgumentException("No updates provided");

        TreatmentEntity treatment = getTreatmentById(treatmentId);

        if (updateDTO.hasNotesUpdate())
            treatment.setNotes(updateDTO.notes());

        if (updateDTO.hasPaymentUpdate()) {
            treatment.setAmountPaid(updateDTO.amountPaid());
            float newRemainingBalance = treatment.getCost() - updateDTO.amountPaid();
            treatment.setRemainingBalance(newRemainingBalance);
        }

        if (updateDTO.hasInstallmentUpdate())
            treatment.setInstallmentPeriodInMonths(updateDTO.installmentPeriodInMonths());

        treatmentRepository.save(treatment);
    }

    public TreatmentEntity getTreatmentById(UUID treatmentId) {
        return treatmentRepository.findById(treatmentId)
                .orElseThrow(() -> new EntityNotFoundException("Treatment not found with ID: " + treatmentId));
    }

    public List<TreatmentResponseDTO> getTreatmentsByPatient(String email) {
        PatientEntity patient = userValidationService.validateAndGetPatient(email);
        List<TreatmentEntity> treatments = treatmentRepository.findAllByPatient(patient);
        return treatments.stream()
                .map(TreatmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TreatmentResponseDTO> getTreatmentsByDoctor(String email) {
        EmployeeEntity doctor = userValidationService.validateAndGetDoctor(email);
        List<TreatmentEntity> treatments = treatmentRepository.findAllByDoctor(doctor);
        return treatments.stream()
                .map(TreatmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    public List<TreatmentResponseDTO> filterTreatments(TreatmentFilterDTO filterDTO) {
        List<TreatmentEntity> treatments;

        if (!filterDTO.hasFilters()) {
            treatments = findAllByAppointmentStartDateTimeAfterAndAppointmentStatus(
                    AppointmentStatus.COMPLETED,
                    LocalDateTime.now().minusDays(30)
            );
        } else {
            if (filterDTO.doctorEmail() != null)
                userValidationService.validateAndGetDoctor(filterDTO.doctorEmail());

            if (filterDTO.patientEmail() != null)
                userValidationService.validateAndGetPatient(filterDTO.patientEmail());

            if (filterDTO.fromDate() != null && filterDTO.toDate() != null)
                if (filterDTO.fromDate().isAfter(filterDTO.toDate()))
                    throw new IllegalArgumentException("From date cannot be after to date");

            LocalDateTime fromDateTime = filterDTO.fromDate() != null ? filterDTO.fromDate().atStartOfDay() : null;
            LocalDateTime toDateTime = filterDTO.toDate() != null ? filterDTO.toDate().atTime(23, 59, 59) : null;

            treatments = findTreatmentsDynamically(
                    filterDTO.doctorEmail(),
                    filterDTO.patientEmail(),
                    fromDateTime,
                    toDateTime
            );

            if (filterDTO.notes() != null && !filterDTO.notes().trim().isEmpty()) {
                String notesKeyword = filterDTO.notes().toLowerCase();
                treatments = treatments.stream()
                        .filter(treatment -> treatment.getNotes() != null &&
                                treatment.getNotes().toLowerCase().contains(notesKeyword))
                        .toList();
            }

            if (filterDTO.prescriptionName() != null && !filterDTO.prescriptionName().trim().isEmpty()) {
                String prescriptionKeyword = filterDTO.prescriptionName().toLowerCase();
                treatments = treatments.stream()
                        .filter(treatment -> treatment.getPrescriptions() != null &&
                                treatment.getPrescriptions().stream()
                                        .anyMatch(prescription ->
                                                prescription.getName() != null &&
                                                        prescription.getName().toLowerCase().contains(prescriptionKeyword)))
                        .toList();
            }
        }

        // Convert to DTOs to avoid circular references
        return treatments.stream()
                .map(TreatmentResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    private List<TreatmentEntity> findTreatmentsDynamically(String doctorEmail,
                                                            String patientEmail,
                                                            LocalDateTime fromDate,
                                                            LocalDateTime toDate) {
        StringBuilder queryBuilder = new StringBuilder();
        queryBuilder.append("SELECT t FROM TreatmentEntity t ");
        queryBuilder.append("JOIN FETCH t.doctor d ");
        queryBuilder.append("JOIN FETCH t.patient p ");
        queryBuilder.append("LEFT JOIN FETCH t.prescriptions ");
        queryBuilder.append("WHERE 1=1 ");

        Map<String, Object> parameters = new HashMap<>();

        if (doctorEmail != null) {
            queryBuilder.append("AND d.email = :doctorEmail ");
            parameters.put("doctorEmail", doctorEmail);
        }

        if (patientEmail != null) {
            queryBuilder.append("AND p.email = :patientEmail ");
            parameters.put("patientEmail", patientEmail);
        }

        if (fromDate != null) {
            queryBuilder.append("AND t.treatmentDate >= :fromDate ");
            parameters.put("fromDate", fromDate);
        }

        if (toDate != null) {
            queryBuilder.append("AND t.treatmentDate <= :toDate ");
            parameters.put("toDate", toDate);
        }

        queryBuilder.append("ORDER BY t.treatmentDate DESC");

        TypedQuery<TreatmentEntity> query = entityManager.createQuery(queryBuilder.toString(), TreatmentEntity.class);

        parameters.forEach(query::setParameter);

        return query.getResultList();
    }

    private List<TreatmentEntity> findAllByAppointmentStartDateTimeAfterAndAppointmentStatus(AppointmentStatus appointmentStatus, LocalDateTime dateTime) {
        return treatmentRepository.findAllByAppointmentStartDateTimeAfterAndAppointmentStatus(
                dateTime,
                appointmentStatus
        );
    }

    private TreatmentEntity createTreatmentEntity(TreatmentDetailsDTO treatmentDetail,
                                                  EmployeeEntity doctor,
                                                  PatientEntity patient,
                                                  String treatment,
                                                  AppointmentEntity appointment) {
        int cost = treatmentDetail.cost();
        int amountPaid = treatmentDetail.amountPaid();
        float remainingBalance = cost - amountPaid;
        int installmentPeriodInMonths = treatmentDetail.installmentPeriodInMonths();

        return new TreatmentEntity(
                doctor,
                patient,
                appointment,
                treatment,
                cost,
                amountPaid,
                installmentPeriodInMonths,
                remainingBalance
        );
    }

    private PrescriptionEntity createPrescriptionEntity(PrescriptionDTO prescriptionDTO, TreatmentEntity treatment) {
        return new PrescriptionEntity(
                treatment,
                prescriptionDTO.name(),
                prescriptionDTO.dosage(),
                prescriptionDTO.duration(),
                prescriptionDTO.frequency(),
                prescriptionDTO.instructions()
        );
    }
}