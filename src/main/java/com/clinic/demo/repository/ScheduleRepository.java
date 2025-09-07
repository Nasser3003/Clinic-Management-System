package com.clinic.demo.repository;

import com.clinic.demo.models.entity.ScheduleEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface ScheduleRepository extends JpaRepository<ScheduleEntity, Long> {
    Optional<ScheduleEntity> findScheduleByDayOfWeek(DayOfWeek dayOfWeek);
    Set<ScheduleEntity> findScheduleByEmployee(EmployeeEntity employee);
    Optional<ScheduleEntity> findScheduleByEmployeeAndDayOfWeek(EmployeeEntity employee, DayOfWeek dayOfWeek);

    Optional<ScheduleEntity> findByEmployeeAndDayOfWeek(EmployeeEntity doctor, DayOfWeek dayOfWeek);

    List<ScheduleEntity> findByEmployee(EmployeeEntity doctor);
}
