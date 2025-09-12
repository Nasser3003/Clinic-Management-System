package com.clinic.demo.DTO.calenderDTO;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class DoctorAvailabilityDTO {
    private UUID doctorId;
    private String firstName;
    private String lastName;
    private String email;
    private boolean available;
}
