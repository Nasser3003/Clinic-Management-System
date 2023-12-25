package com.clinic.demo.models.entitiy.user;

import com.clinic.demo.models.entitiy.RoleEntity;
import com.clinic.demo.models.entitiy.TreatmentEntity;
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
    {
        this.setUserType(UserTypeEnum.PATIENT);
    }
    public PatientEntity(String email, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities) {
        super(email, password, dateOfBirth, authorities);
    }

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @OneToMany(mappedBy = "patient")
    private List<TreatmentEntity> pastTreatmentEntities = new ArrayList<>();

    private String allergies = "None";
    private String healthIssues = "None";
    private String prescriptions = "None";


//    @Override
//    public String toString() {
//        String doctorName = doctor != null ? doctor.getFirstName() + " " + doctor.getLastName() :
//                "No Assigned Doctor" ;
//
//        return "Patient{" +
//                super.toString() +
//                "doctor=" + doctorName +
//                '}';
//    }

    // Money they got to pay for treatment
}
