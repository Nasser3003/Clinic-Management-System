package com.clinic.demo.models.enums;

import lombok.Getter;

@Getter
public enum EmploymentStatusEnum {
    ACTIVE("Active"),
    INACTIVE("Inactive"),
    SUSPENDED("Suspended"),
    TERMINATED("Terminated"),
    ON_LEAVE("On Leave"),
    PROBATION("Probation"),
    RETIRED("Retired");

    private final String displayName;

    EmploymentStatusEnum(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }
}
