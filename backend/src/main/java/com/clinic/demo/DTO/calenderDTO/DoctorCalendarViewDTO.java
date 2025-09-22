package com.clinic.demo.DTO.calenderDTO;

import java.time.LocalDate;
import java.util.List;

public record DoctorCalendarViewDTO(
        String doctorName,
        String doctorEmail,
        LocalDate startDate,
        LocalDate endDate,
        List<AppointmentDTO> appointments,
        List<ScheduleDTO> weeklySchedule,
        List<TimeOffDTO> timeOffPeriods
) {}
