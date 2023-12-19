package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.RoleEntity;
import com.almoatasem.demo.models.entitiy.TreatmentEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@DiscriminatorValue("patient")
@Entity
public class PatientEntity extends AbstractUserEntity {
    public PatientEntity(String username, String email, String password, Set<RoleEntity> authorities) {
        super(username, email, password, authorities);
    }

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private DoctorEntity doctor;

    @OneToMany(mappedBy = "patient")
    private List<TreatmentEntity> pastTreatmentEntities = new ArrayList<>();

    private String allergies = "None";
    private String healthIssues = "None";
    private String prescriptions = "None";


    @Override
    public String toString() {
        String doctorName = doctor != null ? doctor.getFirstName() + " " + doctor.getLastName() :
                "No Assigned Doctor" ;

        return "Patient{" +
                super.toString() +
                "doctor=" + doctorName +
                '}';
    }

    // Money they got to pay for treatment
}
