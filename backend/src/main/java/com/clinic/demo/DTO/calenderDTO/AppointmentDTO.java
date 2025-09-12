package com.clinic.demo.DTO.calenderDTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class AppointmentDTO {
    private UUID id;
    private String doctorName;
    private String patientName;
    private LocalDateTime startDateTime;
    private LocalDateTime endDateTime;
    private int duration;
    private String status;
    private boolean isDone;
}
