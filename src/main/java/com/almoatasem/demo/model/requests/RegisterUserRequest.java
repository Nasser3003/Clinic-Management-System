package com.almoatasem.demo.model.requests;

import java.util.Date;

public record RegisterUserRequest(String firstName, String lastName, String email, String dateOfBirth, String gender) {
}

