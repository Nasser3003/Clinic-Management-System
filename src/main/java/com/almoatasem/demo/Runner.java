package com.almoatasem.demo;

import com.almoatasem.demo.models.entitiy.Role;
import com.almoatasem.demo.models.entitiy.Treatment;
import com.almoatasem.demo.models.entitiy.user.Doctor;
import com.almoatasem.demo.models.entitiy.user.Patient;
import com.almoatasem.demo.repository.*;
import com.almoatasem.demo.repository.userRepos.DoctorRepository;
import com.almoatasem.demo.repository.userRepos.EmployeeRepository;
import com.almoatasem.demo.repository.userRepos.PatientRepository;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.List;
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

    @Autowired
    public Runner(RoleRepository roleRepository, DoctorRepository doctorRepository,
                  PatientRepository patientRepository,
                  EmployeeRepository employeeRepository,
                  TreatmentRepository treatmentRepository,
                  PasswordEncoder encoder) {
        this.roleRepository = roleRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.employeeRepository = employeeRepository;
        this.treatmentRepository = treatmentRepository;
        this.encoder = encoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

        Role createAdminRole = roleRepository.save(new Role("ADMIN"));
        Role createUserRole = roleRepository.save(new Role("USER"));
        Role createPatientRole = roleRepository.save(new Role("PATIENT"));
        Role createDoctorRole = roleRepository.save(new Role("DOCTOR"));


        Set<Role> rolesAdminDoctor = new HashSet<>();
        rolesAdminDoctor.add(createAdminRole);
        rolesAdminDoctor.add(createDoctorRole);
        rolesAdminDoctor.add(createUserRole);

        Set<Role> rolesPatient = new HashSet<Role>();
        rolesPatient.add(createPatientRole);
        rolesPatient.add(createUserRole);

        Doctor docter1 = new Doctor("DoctorAdmin", "DoctorAdmin@gmail.com", encoder.encode("admin"),
                rolesAdminDoctor, 30_000);
        Patient patient1 = new Patient("PatientUser", "PatientUser@gmail.com", encoder.encode("user"),
                rolesPatient);
        doctorRepository.save(docter1);
        patientRepository.save(patient1);
        patient1.setDoctor(docter1);
        patient1.setFirstName("Patient1111111");
        docter1.addPatient(patient1);
        docter1.setFirstName("Doctor1111111");

        Treatment treatment1 = new Treatment(docter1, patient1, "Braces11111", 8000);
        Treatment treatment2 = new Treatment(docter1, patient1, "Braces2222222222", 18000);

        treatmentRepository.save(treatment1);
        treatmentRepository.save(treatment2);

        System.out.println(patient1);
        System.out.println(docter1);

        treatmentRepository.findAllByPatient(patient1).forEach(treatment -> System.out.println(treatment.getTreatment()));
    }
}