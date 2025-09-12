package com.clinic.demo.exception;

public class UserUpdateException extends RuntimeException {
    public UserUpdateException(String message) {
        super(message);
    }

    public UserUpdateException(String message, Exception cause) {
        super(message, cause);
    }
}