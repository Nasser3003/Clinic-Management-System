package com.almoatasem.demo;

import com.almoatasem.demo.models.entitiy.RoleEntity;
import com.almoatasem.demo.models.entitiy.AppointmentEntity;
import com.almoatasem.demo.models.entitiy.TreatmentEntity;
import com.almoatasem.demo.models.entitiy.user.DoctorEntity;
import com.almoatasem.demo.models.entitiy.user.PatientEntity;
import com.almoatasem.demo.repository.RoleRepository;
import com.almoatasem.demo.repository.AppointmentRepository;
import com.almoatasem.demo.repository.TreatmentRepository;
import com.almoatasem.demo.repository.userRepos.DoctorRepository;
import com.almoatasem.demo.repository.userRepos.EmployeeRepository;
import com.almoatasem.demo.repository.userRepos.PatientRepository;
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
@Component
public class Runner implements CommandLineRunner {
    private RoleRepository roleRepository;
    private DoctorRepository doctorRepository;
    private EmployeeRepository employeeRepository;
    private PatientRepository patientRepository;
    private PasswordEncoder encoder;
    private TreatmentRepository treatmentRepository;
    private AppointmentRepository appointmentRepository;

    @Autowired
    public Runner(RoleRepository roleRepository, DoctorRepository doctorRepository,
                  PatientRepository patientRepository,
                  EmployeeRepository employeeRepository,
                  TreatmentRepository treatmentRepository,
                  AppointmentRepository appointmentRepository,
                  PasswordEncoder encoder) {
        this.roleRepository = roleRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.employeeRepository = employeeRepository;
        this.treatmentRepository = treatmentRepository;
        this.appointmentRepository = appointmentRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

        RoleEntity createAdminRoleEntity = roleRepository.save(new RoleEntity("ADMIN"));
        RoleEntity createUserRoleEntity = roleRepository.save(new RoleEntity("USER"));
        RoleEntity createPatientRoleEntity = roleRepository.save(new RoleEntity("PATIENT"));
        RoleEntity createDoctorRoleEntity = roleRepository.save(new RoleEntity("DOCTOR"));

        Set<RoleEntity> rolesAdminDoctor = new HashSet<>();
        rolesAdminDoctor.add(createAdminRoleEntity);
        rolesAdminDoctor.add(createDoctorRoleEntity);
        rolesAdminDoctor.add(createUserRoleEntity);

        Set<RoleEntity> rolesPatient = new HashSet<RoleEntity>();
        rolesPatient.add(createPatientRoleEntity);
        rolesPatient.add(createUserRoleEntity);

        DoctorEntity docterMo3a = new DoctorEntity("DoctorAdmin", "DoctorAdmin@gmail.com",
                encoder.encode("admin"), rolesAdminDoctor);
        doctorRepository.save(docterMo3a);
        docterMo3a.setFirstName("Mo3a");

        PatientEntity patientNasser = new PatientEntity("PatientUser", "PatientUser@gmail.com",
                encoder.encode("user"), rolesPatient);
        patientRepository.save(patientNasser);
        patientNasser.setFirstName("Nasser");

        patientNasser.setDoctor(docterMo3a);
        docterMo3a.addPatient(patientNasser);

        LocalDate date = LocalDate.of(2023, 12, 19);
        LocalTime time = LocalTime.of(10, 30);
//        AppointmentEntity scheduleAppointmentNasserNow = new AppointmentEntity(); // this doesnt give any errors
        AppointmentEntity scheduleAppointmentNasserNow = new AppointmentEntity(docterMo3a, patientNasser, date, time); // passing doctor only or patient only also gives the error
        appointmentRepository.save(scheduleAppointmentNasserNow);

        TreatmentEntity treatmentBraces = new TreatmentEntity(docterMo3a, patientNasser,
                "Braces", 18000);
        TreatmentEntity treatmentFixBraces = new TreatmentEntity(docterMo3a, patientNasser,
                "Fix Braces", 1000);

        treatmentRepository.save(treatmentBraces);
        treatmentRepository.save(treatmentFixBraces);


        treatmentRepository.findAllByPatient(patientNasser)
                .forEach(treatmentEntity -> System.out.println(treatmentEntity.getTreatment()));
    }
}