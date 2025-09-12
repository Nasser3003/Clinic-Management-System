package com.clinic.demo.DTO.calenderDTO;

import com.clinic.demo.DTO.ScheduleSlotDTO;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record CreateScheduleRequestDTO(
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    String email,
    
    @NotEmpty(message = "Schedule slots are required")
    @Valid
    List<ScheduleSlotDTO> schedule
) {}
