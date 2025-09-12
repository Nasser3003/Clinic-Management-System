package com.clinic.demo.models.enums;

public enum TimeOffStatus {
    PENDING("Pending"),
    APPROVED("Approved"),
    DECLINED("Declined");

    private final String displayName;

    TimeOffStatus(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public boolean isFinal() {
        return this == APPROVED || this == DECLINED;
    }

    public boolean canBeModified() {
        return this == PENDING;
    }
}