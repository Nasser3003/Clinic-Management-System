package com.clinic.demo.repository;

import com.clinic.demo.models.entity.TimeOff;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.enums.TimeOffStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {

    // Find time offs for a specific employee ordered by start date (descending)
    List<TimeOff> findByEmployeeOrderByStartDateTimeDesc(EmployeeEntity employee);

    // Find time offs for a specific employee with a specific status
    List<TimeOff> findByEmployeeAndStatus(EmployeeEntity employee, TimeOffStatus status);

    // Find time offs by status only
    List<TimeOff> findByStatus(TimeOffStatus status);

    // Find time offs by status ordered by start date (ascending)
    List<TimeOff> findByStatusOrderByStartDateTimeAsc(TimeOffStatus status);

    // Find overlapping time off periods for an employee (APPROVED or PENDING)
    @Query("SELECT t FROM TimeOff t WHERE t.employee = :employee " +
            "AND t.status IN ('APPROVED', 'PENDING') " +
            "AND ((t.startDateTime <= :endDateTime AND t.endDateTime >= :startDateTime))")
    List<TimeOff> findByEmployeeAndDateTimeRange(
            @Param("employee") EmployeeEntity employee,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );

    // Better query for hasTimeOffOnDate method
    @Query("SELECT COUNT(t) > 0 FROM TimeOff t WHERE t.employee = :employee " +
            "AND t.status = 'APPROVED' " +
            "AND :date BETWEEN DATE(t.startDateTime) AND DATE(t.endDateTime)")
    boolean hasTimeOffOnDate(@Param("employee") EmployeeEntity employee, @Param("date") LocalDate date);

    // Find currently active time offs (approved and currently ongoing)
    @Query("SELECT t FROM TimeOff t WHERE t.status = 'APPROVED' " +
            "AND t.startDateTime <= :currentDateTime " +
            "AND t.endDateTime >= :currentDateTime")
    List<TimeOff> findActiveTimeOffs(@Param("currentDateTime") LocalDateTime currentDateTime);

    // Find time offs for an employee within a date range
    @Query("SELECT t FROM TimeOff t WHERE t.employee = :employee " +
            "AND t.startDateTime <= :endDateTime " +
            "AND t.endDateTime >= :startDateTime " +
            "ORDER BY t.startDateTime ASC")
    List<TimeOff> findEmployeeTimeOffsInRange(
            @Param("employee") EmployeeEntity employee,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );
}