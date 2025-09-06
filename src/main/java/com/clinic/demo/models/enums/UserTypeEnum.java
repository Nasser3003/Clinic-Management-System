package com.clinic.demo.models.enums;

import lombok.Getter;


@Getter
public enum UserTypeEnum {

    ADMIN("Administrator", "System administrator with full access"),
    DOCTOR("Doctor", "Medical practitioner providing patient care"),
    NURSE("Nurse", "Healthcare professional assisting with patient care"),
    PATIENT("Patient", "Individual receiving medical care"),
    EMPLOYEE("Employee", "General clinic staff member"),
    RECEPTIONIST("Receptionist", "Front desk staff managing appointments and patients"),
    LAB_TECHNICIAN("Lab Technician", "Laboratory staff processing tests"),
    PARTNER("Partner", "External partner organization");

    private final String displayName;
    private final String description;

    UserTypeEnum(String displayName, String description) {
        this.displayName = displayName;
        this.description = description;
    }

    public boolean isClinicalRole() {
        return this == DOCTOR || this == NURSE || this == LAB_TECHNICIAN;
    }

    public boolean isAdministrativeRole() {
        return this == ADMIN || this == RECEPTIONIST;
    }

    public boolean isPatientRole() {
        return this == PATIENT;
    }

    public boolean isExternalRole() {
        return this == PARTNER;
    }
}