package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.Role;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

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

    @Override
    public String toString() {
        String doctorName = doctor != null ? doctor.getFirstName() + " " + doctor.getLastName() :
                "No Assigned Doctor" ;

        return "Patient{" +
                super.toString() +
                "doctor=" + doctorName +
                '}';
    }

// bills
    // prescriptions


}
