package com.clinic.demo;

import com.clinic.demo.models.entity.RoleEntity;
import com.clinic.demo.models.entity.user.AdminEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.RoleRepository;
import com.clinic.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Component
@Transactional
public class Runner implements CommandLineRunner {
    private RoleRepository roleRepository;
    private UserRepository userRepository;
    private PasswordEncoder encoder;

    // todo paying methods

    @Override
    public void run(String... args) {
        // Check if roles already exist to avoid duplicates
        if (roleRepository.findByName("ADMIN_ROLE").isPresent()) {
            System.out.println("Data already initialized, skipping...");
            return;
        }

        System.out.println("Initializing data...");

        // Create roles with proper names
        RoleEntity adminRole = roleRepository.save(new RoleEntity("ADMIN_ROLE"));
        RoleEntity userRole = roleRepository.save(new RoleEntity("USER_ROLE"));
        RoleEntity patientRole = roleRepository.save(new RoleEntity("PATIENT_ROLE"));
        RoleEntity doctorRole = roleRepository.save(new RoleEntity("DOCTOR_ROLE"));

        // Create role sets
        Set<RoleEntity> rolesAdmin = new HashSet<>();
        rolesAdmin.add(adminRole);
        rolesAdmin.add(userRole);

        Set<RoleEntity> rolesDoctor = new HashSet<>();
        rolesDoctor.add(doctorRole);
        rolesDoctor.add(userRole);

        Set<RoleEntity> rolesPatient = new HashSet<>();
        rolesPatient.add(patientRole);
        rolesPatient.add(userRole);

        // Create and save users separately
        AdminEntity admin = new AdminEntity(
                "Admin",
                "Admin",
                "admin1@gmail.com",
                "+1234567890",
                "nationalIdAdminAdmin",
                GenderEnum.M,
                encoder.encode("Admin1@gmail.com"),
                LocalDate.of(1997, 11, 27),
                rolesAdmin
        );
        userRepository.save(admin);

        EmployeeEntity doctor = new EmployeeEntity(
                "Doctor",
                "Mo3a",
                "doctor@gmail.com",
                "+9876543210",
                "DOC123456",
                GenderEnum.M,
                UserTypeEnum.DOCTOR,
                encoder.encode("doctor"),
                LocalDate.of(1985, 5, 15),
                5000.0f,
                rolesDoctor
        );
        userRepository.save(doctor);

        PatientEntity patient = new PatientEntity(
                "Nasser",
                "Patient",
                "patient@gmail.com",
                "+1122334455",
                GenderEnum.M,
                UserTypeEnum.PATIENT,
                encoder.encode("patient"),
                LocalDate.of(1990, 8, 20),
                rolesPatient
        );

        Set<String> allergies = new HashSet<>(Set.of(
                "Penicillin",
                "Latex",
                "Local Anesthetics",
                "Aspirin"
        ));

        Set<String> healthIssues = new HashSet<>(Set.of(
                "Hypertension",
                "Diabetes Type 2",
                "Asthma",
                "Arthritis"
        ));

        Set<String> prescriptions = new HashSet<>(Set.of(
                "Amoxicillin 500mg",
                "Ibuprofen 400mg",
                "Paracetamol 500mg",
                "Metformin 850mg"
        ));

        patient.setAllergies(allergies);
        patient.setHealthIssues(healthIssues);
        patient.setPrescriptions(prescriptions);

        userRepository.save(patient);

        patient.setAllergies(allergies);
        patient.setHealthIssues(healthIssues);
        patient.setPrescriptions(prescriptions);
    }
}