// TimeOffNotFoundException.java
package com.clinic.demo.exception;

public class TimeOffNotFoundException extends RuntimeException {
    public TimeOffNotFoundException(String message) {
        super(message);
    }
    
    public TimeOffNotFoundException(Long timeOffId) {
        super("Time off not found with id: " + timeOffId);
    }
}