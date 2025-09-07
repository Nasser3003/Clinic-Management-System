package com.clinic.demo.DTO.calenderDTO;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DoctorCalendarViewDTO {
    private String doctorName;
    private String doctorEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private List<AppointmentDTO> appointments;
    private List<ScheduleDTO> weeklySchedule;
    private List<TimeOffDTO> timeOffPeriods;
}

