package com.clinic.demo.service;

import com.clinic.demo.DTO.calenderDTO.TimeOffApprovalDTO;
import com.clinic.demo.DTO.calenderDTO.TimeOffDTO;
import com.clinic.demo.exception.TimeOffNotFoundException;
import com.clinic.demo.exception.TimeOffOverlapException;
import com.clinic.demo.exception.TimeOffValidationException;
import com.clinic.demo.models.entity.TimeOff;
import com.clinic.demo.models.entity.user.BaseUserEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.enums.TimeOffStatus;
import com.clinic.demo.repository.TimeOffRepository;
import com.clinic.demo.utils.Validations;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@Transactional(readOnly = true)
public class TimeOffService {

    private static final Logger logger = LoggerFactory.getLogger(TimeOffService.class);

    private final TimeOffRepository timeOffRepository;
    private final UserService userService;

    @Transactional
    public TimeOffDTO createTimeOff(String employeeEmail, TimeOffDTO timeOffDTO) {
        validateTimeOffRequest(timeOffDTO);

        BaseUserEntity user = userService.findUserByEmail(employeeEmail);
        if (!Validations.isInstanceOfEmployee(user))
            throw new TimeOffValidationException("User with email " + employeeEmail + " is not an employee");

        EmployeeEntity employee = (EmployeeEntity) user;

        // Check for overlapping time off periods
        checkForOverlappingTimeOff(employee, timeOffDTO.getStartDateTime(), timeOffDTO.getEndDateTime(), null);

        TimeOff timeOff = buildTimeOffEntity(timeOffDTO, employee);
        TimeOff savedTimeOff = timeOffRepository.save(timeOff);

        logger.info("Time off request created for employee: {} with status: PENDING", employeeEmail);
        return mapToDTO(savedTimeOff, employee);
    }

    @Transactional
    public TimeOffDTO updateTimeOffStatus(Long timeOffId, TimeOffApprovalDTO approvalDTO, String adminEmail) {
        validateApprovalRequest(approvalDTO);

        TimeOff timeOff = findTimeOffById(timeOffId);

        if (timeOff.getStatus() != TimeOffStatus.PENDING)
            throw new TimeOffValidationException("Time off request has already been processed");

        timeOff.setStatus(approvalDTO.getStatus());
        timeOff.setApprovedBy(adminEmail);
        timeOff.setApprovalNotes(approvalDTO.getApprovalNotes());

        TimeOff updatedTimeOff = timeOffRepository.save(timeOff);
        logger.info("Time off {} by admin: {} for request id: {}",
                approvalDTO.getStatus().name().toLowerCase(), adminEmail, timeOffId);

        return mapToDTO(updatedTimeOff, updatedTimeOff.getEmployee());
    }

    @Transactional
    public TimeOffDTO updateTimeOff(Long timeOffId, TimeOffDTO timeOffDTO) {
        validateTimeOffRequest(timeOffDTO);

        TimeOff existingTimeOff = findTimeOffById(timeOffId);

        if (existingTimeOff.getStatus() != TimeOffStatus.PENDING)
            throw new TimeOffValidationException("Cannot update time off request that has been processed");

        // Check for overlapping time off periods (excluding the current one)
        checkForOverlappingTimeOff(existingTimeOff.getEmployee(),
                timeOffDTO.getStartDateTime(), timeOffDTO.getEndDateTime(), timeOffId);

        updateTimeOffEntity(existingTimeOff, timeOffDTO);
        TimeOff updatedTimeOff = timeOffRepository.save(existingTimeOff);

        logger.info("Time off updated for id: {}", timeOffId);
        return mapToDTO(updatedTimeOff, updatedTimeOff.getEmployee());
    }

    @Transactional
    public void deleteTimeOff(Long timeOffId) {
        TimeOff timeOff = findTimeOffById(timeOffId);

        if (timeOff.getStatus() == TimeOffStatus.APPROVED)
            throw new TimeOffValidationException("Cannot delete approved time off requests");

        timeOffRepository.delete(timeOff);
        logger.info("Time off deleted with id: {}", timeOffId);
    }

    public List<TimeOffDTO> getEmployeeTimeOffs(String employeeEmail) {
        EmployeeEntity employee = validateAndGetEmployee(employeeEmail);
        List<TimeOff> timeOffs = timeOffRepository.findByEmployeeOrderByStartDateTimeDesc(employee);

        return timeOffs.stream()
                .map(timeOff -> mapToDTO(timeOff, employee))
                .collect(Collectors.toList());
    }

    public List<TimeOffDTO> getEmployeeTimeOffsByStatus(String employeeEmail, TimeOffStatus status) {
        EmployeeEntity employee = validateAndGetEmployee(employeeEmail);
        List<TimeOff> timeOffs = timeOffRepository.findByEmployeeAndStatus(employee, status);

        return timeOffs.stream()
                .map(timeOff -> mapToDTO(timeOff, employee))
                .collect(Collectors.toList());
    }

    public List<TimeOffDTO> getEmployeeTimeOffsInRange(String employeeEmail,
                                                       LocalDateTime startDateTime, LocalDateTime endDateTime) {
        if (startDateTime.isAfter(endDateTime))
            throw new TimeOffValidationException("Start date time cannot be after end date time");

        EmployeeEntity employee = validateAndGetEmployee(employeeEmail);
        List<TimeOff> timeOffs = timeOffRepository.findEmployeeTimeOffsInRange(employee, startDateTime, endDateTime);

        return timeOffs.stream()
                .map(timeOff -> mapToDTO(timeOff, employee))
                .collect(Collectors.toList());
    }

    public boolean hasTimeOffOnDateTime(String employeeEmail, LocalDateTime dateTime) {
        EmployeeEntity employee = validateAndGetEmployee(employeeEmail);
        return timeOffRepository.hasTimeOffOnDate(employee, dateTime.toLocalDate());
    }

    public List<TimeOffDTO> getAllActiveTimeOffs() {
        List<TimeOff> activeTimeOffs = timeOffRepository.findActiveTimeOffs(LocalDateTime.now());
        return activeTimeOffs.stream()
                .map(timeOff -> mapToDTO(timeOff, timeOff.getEmployee()))
                .collect(Collectors.toList());
    }

    public List<TimeOffDTO> getPendingTimeOffs() {
        List<TimeOff> pendingTimeOffs = timeOffRepository.findByStatusOrderByStartDateTimeAsc(TimeOffStatus.PENDING);
        return pendingTimeOffs.stream()
                .map(timeOff -> mapToDTO(timeOff, timeOff.getEmployee()))
                .collect(Collectors.toList());
    }

    public List<TimeOffDTO> getTimeOffsByStatus(TimeOffStatus status) {
        List<TimeOff> timeOffs = timeOffRepository.findByStatus(status);
        return timeOffs.stream()
                .map(timeOff -> mapToDTO(timeOff, timeOff.getEmployee()))
                .collect(Collectors.toList());
    }

    // Helper methods
    private TimeOff findTimeOffById(Long timeOffId) {
        return timeOffRepository.findById(timeOffId)
                .orElseThrow(() -> new TimeOffNotFoundException(timeOffId));
    }

    private EmployeeEntity validateAndGetEmployee(String employeeEmail) {
        BaseUserEntity user = userService.findUserByEmail(employeeEmail);
        if (!Validations.isInstanceOfEmployee(user))
            throw new TimeOffValidationException("User with email " + employeeEmail + " is not an employee");
        return (EmployeeEntity) user;
    }

    private void checkForOverlappingTimeOff(EmployeeEntity employee, LocalDateTime startDateTime,
                                            LocalDateTime endDateTime, Long excludeTimeOffId) {
        List<TimeOff> overlappingTimeOffs = timeOffRepository.findByEmployeeAndDateTimeRange(
                employee, startDateTime, endDateTime);

        if (excludeTimeOffId != null) {
            overlappingTimeOffs = overlappingTimeOffs.stream()
                    .filter(timeOff -> !timeOff.getId().equals(excludeTimeOffId))
                    .toList();
        }

        if (!overlappingTimeOffs.isEmpty())
            throw new TimeOffOverlapException();
    }

    private void validateTimeOffRequest(TimeOffDTO timeOffDTO) {
        if (timeOffDTO.getStartDateTime() == null)
            throw new TimeOffValidationException("Start date time is required");

        if (timeOffDTO.getEndDateTime() == null)
            throw new TimeOffValidationException("End date time is required");

        if (timeOffDTO.getStartDateTime().isAfter(timeOffDTO.getEndDateTime()))
            throw new TimeOffValidationException("Start date time cannot be after end date time");

        if (timeOffDTO.getStartDateTime().isBefore(LocalDateTime.now().minusDays(1)))
            throw new TimeOffValidationException("Cannot create time off for past dates");

        if (timeOffDTO.getReason() != null && timeOffDTO.getReason().trim().isEmpty())
            timeOffDTO.setReason(null);

    }

    private void validateApprovalRequest(TimeOffApprovalDTO approvalDTO) {
        if (approvalDTO.getStatus() == TimeOffStatus.PENDING)
            throw new TimeOffValidationException("Cannot update status to PENDING");

        if (!approvalDTO.isValidStatus())
            throw new TimeOffValidationException("Status must be APPROVED or DECLINED");

    }

    private TimeOff buildTimeOffEntity(TimeOffDTO timeOffDTO, EmployeeEntity employee) {
        TimeOff timeOff = new TimeOff();
        timeOff.setEmployee(employee);
        timeOff.setStartDateTime(timeOffDTO.getStartDateTime());
        timeOff.setEndDateTime(timeOffDTO.getEndDateTime());
        timeOff.setReason(timeOffDTO.getReason());
        timeOff.setStatus(TimeOffStatus.PENDING);
        return timeOff;
    }

    private void updateTimeOffEntity(TimeOff timeOff, TimeOffDTO timeOffDTO) {
        timeOff.setStartDateTime(timeOffDTO.getStartDateTime());
        timeOff.setEndDateTime(timeOffDTO.getEndDateTime());
        timeOff.setReason(timeOffDTO.getReason());
    }

    private TimeOffDTO mapToDTO(TimeOff timeOff, EmployeeEntity employee) {
        return TimeOffDTO.builder()
                .id(timeOff.getId())
                .startDateTime(timeOff.getStartDateTime())
                .endDateTime(timeOff.getEndDateTime())
                .reason(timeOff.getReason())
                .status(timeOff.getStatus())
                .approvedBy(timeOff.getApprovedBy())
                .approvalNotes(timeOff.getApprovalNotes())
                .createdAt(timeOff.getCreatedAt())
                .updatedAt(timeOff.getUpdatedAt())
                .employeeEmail(employee.getEmail())
                .employeeName(employee.getFirstName() + " " + employee.getLastName())
                .build();
    }
}