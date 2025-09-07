package com.clinic.demo.controller;

import com.clinic.demo.DTO.calenderDTO.AvailableTimeSlotDTO;
import com.clinic.demo.DTO.calenderDTO.DoctorAvailabilityDTO;
import com.clinic.demo.DTO.calenderDTO.DoctorCalendarViewDTO;
import com.clinic.demo.DTO.calenderDTO.PatientCalendarViewDTO;
import com.clinic.demo.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
public class CalendarController {
    
    private final CalendarService calendarService;
    
    /**
     * Get available time slots for a doctor on a specific date
     */
    @GetMapping("/available-slots")
    public ResponseEntity<List<AvailableTimeSlotDTO>> getAvailableSlots(
            @RequestParam String doctorEmail,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam(defaultValue = "30") int duration) {
        
        List<AvailableTimeSlotDTO> slots = calendarService.getAvailableSlots(doctorEmail, date, duration);
        return ResponseEntity.ok(slots);
    }
    
    /**
     * Get doctor's calendar view
     */
    @GetMapping("/doctor/{doctorEmail}")
    public ResponseEntity<DoctorCalendarViewDTO> getDoctorCalendar(
            @PathVariable String doctorEmail,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        DoctorCalendarViewDTO calendar = calendarService.getDoctorCalendarView(doctorEmail, startDate, endDate);
        return ResponseEntity.ok(calendar);
    }
    
    /**
     * Get patient's calendar view
     */
    @GetMapping("/patient/{patientEmail}")
    public ResponseEntity<PatientCalendarViewDTO> getPatientCalendar(
            @PathVariable String patientEmail,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        PatientCalendarViewDTO calendar = calendarService.getPatientCalendarView(patientEmail, startDate, endDate);
        return ResponseEntity.ok(calendar);
    }
    
    /**
     * Get available doctors for a specific time slot
     */
    @GetMapping("/available-doctors")
    public ResponseEntity<List<DoctorAvailabilityDTO>> getAvailableDoctors(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.TIME) LocalTime startTime,
            @RequestParam(defaultValue = "30") int duration) {
        
        List<DoctorAvailabilityDTO> doctors = calendarService.getAvailableDoctors(date, startTime, duration);
        return ResponseEntity.ok(doctors);
    }
}