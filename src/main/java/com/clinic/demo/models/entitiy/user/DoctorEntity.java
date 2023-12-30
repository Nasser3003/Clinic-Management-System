package com.clinic.demo.models.entitiy.user;

import com.clinic.demo.models.entitiy.AppointmentEntity;
import com.clinic.demo.models.entitiy.RoleEntity;
import com.clinic.demo.models.enums.UserTypeEnum;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Setter
@Getter
@NoArgsConstructor
@Entity
@Table(name = "user_doctor")
public class DoctorEntity extends AbstractUserEntity {
    {
        this.setUserType(UserTypeEnum.DOCTOR);
    }
    public DoctorEntity(String email, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities) {
        super(email, password, dateOfBirth, authorities);
    }
    public DoctorEntity(String email, String password, LocalDate dateOfBirth, Set<RoleEntity> authorities, double salary) {
        super(email, password, dateOfBirth, authorities);
        this.salary = salary;
    }

    private double salary;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private Set<PatientEntity> patients = new HashSet<>();

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private Set<AppointmentEntity> schedule = new HashSet<>();

    public void addPatient(PatientEntity patientEntity) {
        patients.add(patientEntity);
    }
    public void removePatient(PatientEntity patientEntity) {
        patients.remove(patientEntity);
    }

//    @Override
//    public String toString() {
//        String patientNames = (!patients.isEmpty()) ?
//                patients.stream()
//                        .map(patient -> getFirstName() + " " + getLastName())
//                        .collect(Collectors.joining(", ")) : "No Patients";
//
//        return "Doctor{" +
//                "salary=" + salary +
//                ", patients=" + patientNames +
//                '}' +
//                super.toString();
//    }

}