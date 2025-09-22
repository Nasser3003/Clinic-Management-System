package com.clinic.demo.Mapper;

import com.clinic.demo.DTO.calenderDTO.AppointmentDTO;
import com.clinic.demo.models.entity.AppointmentEntity;

public class AppointmentMapper {

    public static AppointmentDTO toDTO(AppointmentEntity entity) {
        if (entity == null)
            return null;

        String doctorName = entity.getDoctor() != null
                ? entity.getDoctor().getFirstName() + " " + entity.getDoctor().getLastName()
                : null;

        String patientName = entity.getPatient() != null
                ? entity.getPatient().getFirstName() + " " + entity.getPatient().getLastName()
                : null;

        return new AppointmentDTO(
                entity.getId(),
                doctorName,
                patientName,
                entity.getStartDateTime(),
                entity.getEndDateTime(),
                entity.getDurationInMins(),
                entity.getStatus(),
                entity.getReason()
        );
    }
}
