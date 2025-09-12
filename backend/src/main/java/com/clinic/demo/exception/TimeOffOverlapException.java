package com.clinic.demo.exception;

public class TimeOffOverlapException extends RuntimeException {
    public TimeOffOverlapException(String message) {
        super(message);
    }

    public TimeOffOverlapException() {
        super("Time off period overlaps with existing approved time off");
    }
}
