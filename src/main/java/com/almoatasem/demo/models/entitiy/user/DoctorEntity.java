package com.almoatasem.demo.models.entitiy.user;

import com.almoatasem.demo.models.entitiy.AppointmentEntity;
import com.almoatasem.demo.models.entitiy.RoleEntity;
import com.almoatasem.demo.models.enums.UserTypeEnum;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    public DoctorEntity(String email, String password, Set<RoleEntity> authorities) {
        super(email, password, authorities);
    }
    public DoctorEntity(String email, String password, Set<RoleEntity> authorities, double salary) {
        super(email, password, authorities);
        this.salary = salary;
    }

    private double salary;

    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL)
    private Set<PatientEntity> patients = new HashSet<>();

    @OneToMany(mappedBy = "doctor")
    private Set<AppointmentEntity> schedule = new HashSet<>(); ;

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

    public void addPatient(PatientEntity patientEntity) {
        patients.add(patientEntity);
    }
    public void removePatient(PatientEntity patientEntity) {
        patients.remove(patientEntity);
    }
}