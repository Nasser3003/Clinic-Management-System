package com.almoatasem.demo.model.requests;

public record RegisterUserRequest(String firstName, String lastName, String email, String dateOfBirth, String gender) {
}

