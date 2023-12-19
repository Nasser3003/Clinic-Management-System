package com.almoatasem.demo.repository;

import com.almoatasem.demo.models.entitiy.AppointmentEntity;
import com.almoatasem.demo.models.entitiy.user.DoctorEntity;
import com.almoatasem.demo.models.entitiy.user.PatientEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface AppointmentRepository extends JpaRepository<AppointmentEntity, Long> {
    Optional<AppointmentEntity> findScheduleEntitiesByPatient(PatientEntity patient);
    Optional<AppointmentEntity> findScheduleEntitiesByDoctor(DoctorEntity doctor);
    Optional<AppointmentEntity> findScheduleEntitiesByScheduleDateIsAfter(LocalDate afterDate);
    Optional<AppointmentEntity> findScheduleEntitiesByScheduleDateIsBefore(LocalDate beforeDate);

}
