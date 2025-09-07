package com.clinic.demo.repository;

import com.clinic.demo.models.entity.TimeOff;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {
    
    /**
     * Find all time off periods for an employee
     */
    List<TimeOff> findByEmployee(EmployeeEntity employee);
    
    /**
     * Find time off periods for an employee within a date range
     */
    @Query("SELECT t FROM TimeOff t WHERE t.employee = :employee AND " +
           "(DATE(t.startDateTime) <= :endDate AND DATE(t.endDateTime) >= :startDate)")
    List<TimeOff> findByEmployeeAndDateRange(
            @Param("employee") EmployeeEntity employee,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate
    );
    
    /**
     * Find time off periods that overlap with a specific date range
     */
    @Query("SELECT t FROM TimeOff t WHERE t.employee = :employee AND " +
           "t.startDateTime <= :endDateTime AND t.endDateTime >= :startDateTime")
    List<TimeOff> findByEmployeeAndDateTimeRange(
            @Param("employee") EmployeeEntity employee,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );
    
    /**
     * Check if employee has any time off on a specific date
     */
    @Query("SELECT COUNT(t) > 0 FROM TimeOff t WHERE t.employee = :employee AND " +
           "DATE(t.startDateTime) <= :date AND DATE(t.endDateTime) >= :date")
    boolean hasTimeOffOnDate(
            @Param("employee") EmployeeEntity employee,
            @Param("date") LocalDate date
    );
    
    /**
     * Find all active time off periods (current and future)
     */
    @Query("SELECT t FROM TimeOff t WHERE t.endDateTime >= :currentDateTime")
    List<TimeOff> findActiveTimeOffs(@Param("currentDateTime") LocalDateTime currentDateTime);
    
    /**
     * Find time off periods by employee and status (if you add a status field later)
     */
    List<TimeOff> findByEmployeeOrderByStartDateTimeDesc(EmployeeEntity employee);
}