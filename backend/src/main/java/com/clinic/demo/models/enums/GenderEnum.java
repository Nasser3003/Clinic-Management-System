package com.clinic.demo.models.enums;

public enum GenderEnum {
    M("Male"),
    F("Female");

    private final String displayName;

    GenderEnum(String displayName) {
        this.displayName = displayName;
    }

    @Override
    public String toString() {
        return displayName;
    }

    }
