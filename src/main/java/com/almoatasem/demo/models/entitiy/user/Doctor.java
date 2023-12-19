package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.Role;
import jakarta.persistence.Column;
import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@EqualsAndHashCode(callSuper = true)
@Data
@NoArgsConstructor
@DiscriminatorValue("doctor")
@Entity
public class Doctor extends UserInfo {

    public Doctor(String username, String email, String password, Set<Role> authorities, double salary) {
        super(username, email, password, authorities);
        this.salary = salary;
    }

    private double salary;

    @OneToMany(mappedBy = "doctor")
    private Set<Patient> patients = new HashSet<>();

    @Column(name = "scheduled_start_time")
    private LocalDateTime scheduledStartTime;

    @Column(name = "scheduled_end_time")
    private LocalDateTime scheduledEndTime;

    @Override
    public String toString() {
        String patientNames = (!patients.isEmpty()) ?
                patients.stream()
                        .map(patient -> getFirstName() + " " + getLastName())
                        .collect(Collectors.joining(", ")) : "No Patients";

        return "Doctor{" +
                "salary=" + salary +
                ", patients=" + patientNames +
                ", scheduledStartTime=" + scheduledStartTime +
                ", scheduledEndTime=" + scheduledEndTime +
                '}' +
                super.toString();
    }

    public void addPatient(Patient patient) {
        patients.add(patient);
    }
    public void removePatient(Patient patient) {
        patients.remove(patient);
    }

}
