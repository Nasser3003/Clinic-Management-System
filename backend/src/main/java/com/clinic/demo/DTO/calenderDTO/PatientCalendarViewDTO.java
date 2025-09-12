package com.clinic.demo.DTO.calenderDTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class PatientCalendarViewDTO {
    private String patientEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<AppointmentDTO> appointments;
}
