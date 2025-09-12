package com.clinic.demo.exception;

public class TimeOffValidationException extends RuntimeException {
    public TimeOffValidationException(String message) {
        super(message);
    }
}
