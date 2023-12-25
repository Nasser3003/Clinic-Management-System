package com.clinic.demo.exception;

public class EmailAlreadyTakenException extends RuntimeException {
    public EmailAlreadyTakenException() {
        super("email provided is already taken");
    }
}
