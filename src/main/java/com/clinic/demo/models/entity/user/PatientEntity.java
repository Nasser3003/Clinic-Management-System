package com.clinic.demo.models.entity.user;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.TreatmentEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_patient")
public class PatientEntity extends AbstractUserEntity {

    public PatientEntity(String email, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities) {
        super(email, password, dateOfBirth, authorities);
        this.setUserType(UserTypeEnum.PATIENT);
    }

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<TreatmentEntity> pastTreatmentEntities = new ArrayList<>();

    private String allergies = "None";
    private String healthIssues = "None";
    private String prescriptions = "None";


    // Money they got to pay for treatment
}
