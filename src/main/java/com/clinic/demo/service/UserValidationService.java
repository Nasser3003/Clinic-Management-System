package com.clinic.demo.service;

import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class UserValidationService {
    private final UserService userService;

    public void validateDoctorAndPatient(String doctorEmail, String patientEmail) {
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


    public EmployeeEntity getUserAsEmployee(String email) {
        BaseUserEntity user = userService.selectUserByEmail(email);
        if (user instanceof EmployeeEntity) return (EmployeeEntity) user;
        throw new IllegalArgumentException("User with email " + email + " is not an employee");
    }


    public PatientEntity getUserAsPatient(String email) {
        BaseUserEntity user = userService.selectUserByEmail(email);
        if (user instanceof PatientEntity) {
            return (PatientEntity) user;
        }
        throw new IllegalArgumentException("User with email " + email + " is not a patient");
    }
}