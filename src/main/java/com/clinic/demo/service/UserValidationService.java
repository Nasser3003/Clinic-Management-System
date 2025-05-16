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

    public BaseUserEntity validateAndGetBaseUser(String email) {
        if (email == null) throw new IllegalArgumentException("Doctor email must not be null");

        BaseUserEntity user = userService.findUserByEmail(email);

        if (user == null) throw new EntityNotFoundException("User not found with email: " + email);

        return user;
    }

    public EmployeeEntity validateAndGetDoctor(String email) {
        if (email == null) throw new IllegalArgumentException("Doctor email must not be null");

        BaseUserEntity user = userService.findUserByEmail(email);
        if (user == null) throw new EntityNotFoundException("Doctor not found with email: " + email);

        if (user.getUserType() != UserTypeEnum.DOCTOR && user.getUserType() != UserTypeEnum.EMPLOYEE)
            throw new IllegalArgumentException("User with email " + email + " is not a doctor or employee");

        if (!(user instanceof EmployeeEntity))
            throw new IllegalArgumentException("User with email " + email + " is not an employee type");

        return (EmployeeEntity) user;
    }

    public PatientEntity validateAndGetPatient(String email) {
        if (email == null) throw new IllegalArgumentException("Patient email must not be null");

        BaseUserEntity user = userService.findUserByEmail(email);
        if (user == null) throw new EntityNotFoundException("Patient not found with email: " + email);

        if (user.getUserType() != UserTypeEnum.PATIENT)
            throw new IllegalArgumentException("User with email " + email + " is not a patient");

        if (!(user instanceof PatientEntity))
            throw new IllegalArgumentException("User with email " + email + " is not a patient type");

        return (PatientEntity) user;
    }

}