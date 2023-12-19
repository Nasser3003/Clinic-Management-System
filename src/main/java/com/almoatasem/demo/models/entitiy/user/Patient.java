package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.Role;
import com.almoatasem.demo.models.entitiy.Treatment;
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
public class Patient extends UserInfo {
    public Patient(String username, String email, String password, Set<Role> authorities) {
        super(username, email, password, authorities);
    }

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;

    private String allergies;
    private String healthIssues;
    private String prescriptions;

    @OneToMany(mappedBy = "patient", fetch = FetchType.EAGER)
    private List<Treatment> pastTreatments = new ArrayList<>();

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
