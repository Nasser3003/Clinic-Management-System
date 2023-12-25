package com.clinic.demo;

import com.clinic.demo.models.entitiy.AppointmentEntity;
import com.clinic.demo.models.entitiy.RoleEntity;
import com.clinic.demo.models.entitiy.TreatmentEntity;
import com.clinic.demo.models.entitiy.user.AbstractUserEntity;
import com.clinic.demo.models.entitiy.user.AdminEntity;
import com.clinic.demo.models.entitiy.user.DoctorEntity;
import com.clinic.demo.models.entitiy.user.PatientEntity;
import com.clinic.demo.models.enums.AuthorityEnum;
import com.clinic.demo.repository.AppointmentRepository;
import com.clinic.demo.repository.RoleRepository;
import com.clinic.demo.repository.TreatmentRepository;
import com.clinic.demo.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Component
public class Runner implements CommandLineRunner {
    private RoleRepository roleRepository;
    private TreatmentRepository treatmentRepository;
    private AppointmentRepository appointmentRepository;
    private UserRepository userRepository;
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByAuthority(AuthorityEnum.ADMIN).isPresent()) return;

        RoleEntity createAdminRoleEntity = roleRepository.save(new RoleEntity(AuthorityEnum.ADMIN));
        RoleEntity createUserRoleEntity = roleRepository.save(new RoleEntity(AuthorityEnum.USER));
        RoleEntity createPatientRoleEntity = roleRepository.save(new RoleEntity(AuthorityEnum.PATIENT));
        RoleEntity createDoctorRoleEntity = roleRepository.save(new RoleEntity(AuthorityEnum.DOCTOR));

        Set<RoleEntity> rolesAdmin = new HashSet<>();
        rolesAdmin.add(createAdminRoleEntity);

        Set<RoleEntity> rolesDoctor = new HashSet<>();
        rolesDoctor.add(createDoctorRoleEntity);
        rolesDoctor.add(createUserRoleEntity);

        Set<RoleEntity> rolesPatient = new HashSet<>();
        rolesPatient.add(createPatientRoleEntity);
        rolesPatient.add(createUserRoleEntity);

       AdminEntity admin = new AdminEntity("admin@gmail.com",
                encoder.encode("admin"), LocalDate.of(1997, 11, 27), rolesAdmin);
       userRepository.save(admin);

        DoctorEntity docterMo3a = new DoctorEntity("docterMo3a@gmail.com",
                encoder.encode("admin"), LocalDate.of(1997, 11, 27), rolesDoctor);
        setFirstName(docterMo3a, "Mo3a"); // detached state if changed after saving to repo

        PatientEntity patientNasser = new PatientEntity("PatientUser@gmail.com",
                encoder.encode("user"), LocalDate.of(1997, 11, 27), rolesPatient);
        setFirstName(patientNasser, "Nasser"); // detached state if changed after saving to repo

        patientNasser.setDoctor(docterMo3a);
        docterMo3a.addPatient(patientNasser);

        LocalDate date = LocalDate.of(2023, 12, 19);
        LocalTime time = LocalTime.of(10, 30);
        AppointmentEntity newAppointmentNasser = new AppointmentEntity(docterMo3a, patientNasser, date, time);
        appointmentRepository.save(newAppointmentNasser);

        userRepository.save(docterMo3a);
        userRepository.save(patientNasser);

        TreatmentEntity treatmentBraces = new TreatmentEntity(docterMo3a, patientNasser,
                "Braces", 18000);
        TreatmentEntity treatmentFixBraces = new TreatmentEntity(docterMo3a, patientNasser,
                "Fix Braces", 1000);

        treatmentRepository.save(treatmentBraces);
        treatmentRepository.save(treatmentFixBraces);


        treatmentRepository.findAllByPatient(patientNasser)
                .forEach(treatmentEntity -> System.out.println(treatmentEntity.getTreatment()));
        System.out.println(docterMo3a);
        System.out.println(patientNasser);

    }
    protected void setFirstName(AbstractUserEntity user, String firstName) {
        user.setFirstName(firstName);
    }
    protected void setLastName(AbstractUserEntity user, String lastName) {
        user.setFirstName(lastName);
    }

}