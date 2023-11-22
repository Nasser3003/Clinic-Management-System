package com.almoatasem.demo.models.requests;

import java.time.LocalDate;

public record RegisterUserRequest(String firstName, String lastName, String email, LocalDate dateOfBirth, String gender) {
}

