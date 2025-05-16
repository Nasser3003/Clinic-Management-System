package com.clinic.demo.Mapper;


import com.clinic.demo.DTO.userDTO.EmployeeDTO;
import com.clinic.demo.DTO.userDTO.PatientDTO;
import com.clinic.demo.DTO.userDTO.UserInfoDTO;
import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;

import java.util.Set;
import java.util.stream.Collectors;

public class UserMapper {

    public static UserInfoDTO convertToDTO(BaseUserEntity user) {

        return new UserInfoDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhoneNumber(),
                user.getUsername(),
                user.getGender(),
                user.getUserType(),
                user.getNationalId(),
                user.getDateOfBirth(),
                convertAuthoritiesToRoles(user.getRoles()),
                user.isDeleted(),
                user.getCreateDate(),
                user.getLastModifiedDate(),
                user.isAccountNonExpired(),
                user.isAccountNonLocked(),
                user.isCredentialsNonExpired(),
                user.isEnabled(),
                user.getEmergencyContactName(),
                user.getEmergencyContactNumber(),
                user.getNotes()
        );
    }
    
    public static Object convertToSpecializedDTO(BaseUserEntity user) {
        return switch (user.getUserType()) {
            case DOCTOR, EMPLOYEE, ADMIN -> convertToEmployeeDTO((EmployeeEntity) user);
            case PATIENT -> convertToPatientDTO((PatientEntity) user);
            default -> convertToDTO(user);
        };
    }

    private static EmployeeDTO convertToEmployeeDTO(EmployeeEntity employee) {
        return new EmployeeDTO(
                employee.getId(),
                employee.getFirstName(),
                employee.getLastName(),
                employee.getEmail(),
                employee.getPhoneNumber(),
                employee.getUsername(),
                employee.getGender().toString(),
                employee.getUserType().toString(),
                employee.getNationalId(),
                employee.getDateOfBirth(),
                convertAuthoritiesToRoles(employee.getRoles()),
                employee.isDeleted(),
                employee.getCreateDate(),
                employee.getLastModifiedDate(),
                employee.isAccountNonExpired(),
                employee.isAccountNonLocked(),
                employee.isCredentialsNonExpired(),
                employee.isEnabled(),
                employee.getEmergencyContactName(),
                employee.getEmergencyContactNumber(),
                employee.getNotes(),
                employee.getSalary(),
                employee.getDescription()
        );
    }

    private static PatientDTO convertToPatientDTO(PatientEntity patient) {
        return new PatientDTO(
                patient.getId(),
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getPhoneNumber(),
                patient.getUsername(),
                patient.getGender().toString(),
                patient.getUserType().toString(),
                patient.getNationalId(),
                patient.getDateOfBirth(),
                convertAuthoritiesToRoles(patient.getRoles()),
                patient.isDeleted(),
                patient.getCreateDate(),
                patient.getLastModifiedDate(),
                patient.isAccountNonExpired(),
                patient.isAccountNonLocked(),
                patient.isCredentialsNonExpired(),
                patient.getEmergencyContactName(),
                patient.getEmergencyContactNumber(),
                patient.isEnabled(),
                patient.getNotes(),
                patient.getAllergies(),
                patient.getHealthIssues(),
                patient.getPrescriptions()
        );
    }

    private static Set<String> convertAuthoritiesToRoles(Set<RoleEntity> roles) {
        return roles.stream()
                .map(RoleEntity::getName)
                .collect(Collectors.toSet());
    }

}