package com.clinic.demo.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler({EmailAlreadyTakenException.class})
    public ResponseEntity<String> handleEmailTaken() {
        return new ResponseEntity<>("Email you provided is already taken", HttpStatus.CONFLICT);
    }
    @ExceptionHandler({DataIntegrityViolationException.class})
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {
        return new ResponseEntity<>("Email you provided is already taken, Nothing was changed", HttpStatus.CONFLICT);
    }
}
