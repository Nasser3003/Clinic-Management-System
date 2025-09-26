package com.clinic.demo.service;

import com.clinic.demo.DTO.PrescriptionDTO;
import com.clinic.demo.DTO.TreatmentDetailsDTO;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.PrescriptionEntity;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.repository.PrescriptionRepository;
import com.clinic.demo.repository.TreatmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TreatmentService {
    private final TreatmentRepository treatmentRepository;
    private final  PrescriptionRepository prescriptionRepository;

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

    public List<TreatmentEntity> getAllTreatments() {
        return treatmentRepository.findAll();
    }


}