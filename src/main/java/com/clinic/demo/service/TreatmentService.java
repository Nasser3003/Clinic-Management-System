package com.clinic.demo.service;

import com.clinic.demo.DTO.TreatmentDetails;
import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.repository.TreatmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class TreatmentService {
    private final TreatmentRepository treatmentRepository;

    @Transactional
    public void createTreatmentsForAppointment(List<TreatmentDetails> treatmentDetails,
                                               AppointmentEntity appointment) {
        if (treatmentDetails == null || treatmentDetails.isEmpty()) {
            throw new IllegalArgumentException("Treatments list must not be null or empty");
        }
        
        treatmentDetails.stream()
                .map(detail -> createTreatmentEntity(
                        detail, 
                        appointment.getDoctor(),
                        appointment.getPatient(),
                        detail.treatmentDescription(),
                        appointment))
                .forEach(treatmentRepository::save);
    }
    
    private TreatmentEntity createTreatmentEntity(TreatmentDetails treatmentDetail, 
                                                EmployeeEntity doctor, 
                                                PatientEntity patient,
                                                String treatment,
                                                AppointmentEntity appointment) {
        int cost = treatmentDetail.cost();
        int amountPaid = treatmentDetail.amountPaid();
        int remainingBalance = cost - amountPaid;
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
}