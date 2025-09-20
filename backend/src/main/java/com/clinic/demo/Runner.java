package com.clinic.demo;

import com.clinic.demo.models.entity.user.AdminEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
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
    private UserRepository userRepository;
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        // Check if admin user already exists to avoid duplicates
        if (userRepository.findByEmail("admin1@gmail.com").isPresent()) {
            System.out.println("Data already initialized, skipping...");
            return;
        }

        System.out.println("Initializing data...");

        // Create admin permissions
        Set<PermissionEnum> adminPermissions = new HashSet<>(Set.of(
                PermissionEnum.USER_READ,
                PermissionEnum.USER_CREATE,
                PermissionEnum.USER_UPDATE,
                PermissionEnum.USER_DELETE,
                PermissionEnum.PATIENT_READ,
                PermissionEnum.PATIENT_CREATE,
                PermissionEnum.PATIENT_UPDATE,
                PermissionEnum.PATIENT_DELETE,
                PermissionEnum.MEDICAL_RECORD_READ,
                PermissionEnum.MEDICAL_RECORD_CREATE,
                PermissionEnum.MEDICAL_RECORD_UPDATE,
                PermissionEnum.ADMIN_SYSTEM_CONFIG,
                PermissionEnum.ADMIN_USER_MANAGEMENT,
                PermissionEnum.VIEW_REPORTS,
                PermissionEnum.CREATE_REPORTS,
                PermissionEnum.EXPORT_REPORTS,
                PermissionEnum.APPOINTMENT_READ,
                PermissionEnum.APPOINTMENT_CREATE,
                PermissionEnum.APPOINTMENT_UPDATE,
                PermissionEnum.APPOINTMENT_DELETE
        ));

        // Create doctor permissions
        Set<PermissionEnum> doctorPermissions = new HashSet<>(Set.of(
                PermissionEnum.PATIENT_READ,
                PermissionEnum.PATIENT_UPDATE,
                PermissionEnum.MEDICAL_RECORD_READ,
                PermissionEnum.MEDICAL_RECORD_CREATE,
                PermissionEnum.MEDICAL_RECORD_UPDATE,
                PermissionEnum.ORDER_TESTS,
                PermissionEnum.VIEW_TEST_RESULTS,
                PermissionEnum.UPDATE_TEST_RESULTS,
                PermissionEnum.APPOINTMENT_READ,
                PermissionEnum.APPOINTMENT_CREATE,
                PermissionEnum.APPOINTMENT_UPDATE,
                PermissionEnum.VIEW_REPORTS
        ));

        // Create patient permissions
        Set<PermissionEnum> patientPermissions = new HashSet<>(Set.of(
                PermissionEnum.PATIENT_READ_OWN,
                PermissionEnum.MEDICAL_RECORD_READ_OWN,
                PermissionEnum.APPOINTMENT_READ_OWN,
                PermissionEnum.APPOINTMENT_CREATE
        ));

        // Create and save admin user
        AdminEntity admin = new AdminEntity(
                "Admin",
                "Admin",
                "admin1@gmail.com",
                "+1234567890",
                "nationalIdAdminAdmin",
                GenderEnum.M,
                encoder.encode("Admin1@gmail.com"),
                LocalDate.of(1997, 11, 27),
                adminPermissions
        );
        admin.setDepartment("IT");
        userRepository.save(admin);

        // Create and save doctor user
        EmployeeEntity doctor = new EmployeeEntity(
                "Doctor",
                "Mo3a",
                "doctor@gmail.com",
                "+9876543210",
                "DOC123456",
                GenderEnum.M,
                UserTypeEnum.DOCTOR,
                encoder.encode("Doctor@gmail.com1"),
                LocalDate.of(1985, 5, 15),
                5000.0f,
                doctorPermissions
        );
        doctor.setTitle("Dr.");
        doctor.setDepartment("Cardiology");
        doctor.setDescription("Senior Cardiologist with 15+ years experience");
        userRepository.save(doctor);

        // Create and save patient user
        PatientEntity patient = new PatientEntity(
                "Nasser",
                "Patient",
                "abdo.abdo3003@gmail.com",
                "+1122334455",
                GenderEnum.M,
                encoder.encode("Abdo.abdo3003@gmail.com1"),
                LocalDate.of(1990, 8, 20),
                patientPermissions
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

        // Create additional sample users for testing
        createSampleNurse();
        createSampleReceptionist();
        createSampleLabTechnician();

        System.out.println("Data initialization completed successfully!");
        System.out.println("Users created:");
        System.out.println("- Admin: admin1@gmail.com / Admin1@gmail.com");
        System.out.println("- Doctor: doctor@gmail.com / Doctor@gmail.com1");
        System.out.println("- Patient: abdo.abdo3003@gmail.com / Abdo.abdo3003@gmail.com1");
        System.out.println("- Nurse: nurse@gmail.com / Nurse@gmail.com1");
        System.out.println("- Receptionist: receptionist@gmail.com / Receptionist@gmail.com1");
        System.out.println("- Lab Tech: labtech@gmail.com / LabTech@gmail.com1");
    }

    private void createSampleNurse() {
        Set<PermissionEnum> nursePermissions = new HashSet<>(Set.of(
                PermissionEnum.PATIENT_READ,
                PermissionEnum.PATIENT_UPDATE,
                PermissionEnum.MEDICAL_RECORD_READ,
                PermissionEnum.MEDICAL_RECORD_UPDATE,
                PermissionEnum.VIEW_TEST_RESULTS,
                PermissionEnum.APPOINTMENT_READ,
                PermissionEnum.APPOINTMENT_UPDATE
        ));

        EmployeeEntity nurse = new EmployeeEntity(
                "Nurse",
                "Sarah",
                "nurse@gmail.com",
                "+1555666777",
                "NURSE001",
                GenderEnum.F,
                UserTypeEnum.NURSE,
                encoder.encode("Nurse@gmail.com1"),
                LocalDate.of(1988, 3, 12),
                3500.0f,
                nursePermissions
        );
        nurse.setTitle("RN");
        nurse.setDepartment("General Ward");
        nurse.setDescription("Registered Nurse with 8 years experience");
        userRepository.save(nurse);
    }

    private void createSampleReceptionist() {
        Set<PermissionEnum> receptionistPermissions = new HashSet<>(Set.of(
                PermissionEnum.PATIENT_READ,
                PermissionEnum.PATIENT_CREATE,
                PermissionEnum.APPOINTMENT_READ,
                PermissionEnum.APPOINTMENT_CREATE,
                PermissionEnum.APPOINTMENT_UPDATE
        ));

        EmployeeEntity receptionist = new EmployeeEntity(
                "Receptionist",
                "Lisa",
                "receptionist@gmail.com",
                "+1777888999",
                "RECEP001",
                GenderEnum.F,
                UserTypeEnum.RECEPTIONIST,
                encoder.encode("Receptionist@gmail.com1"),
                LocalDate.of(1992, 7, 8),
                2500.0f,
                receptionistPermissions
        );
        receptionist.setDepartment("Front Desk");
        receptionist.setDescription("Front desk receptionist handling appointments and patient check-ins");
        userRepository.save(receptionist);
    }

    private void createSampleLabTechnician() {
        Set<PermissionEnum> labTechPermissions = new HashSet<>(Set.of(
                PermissionEnum.ORDER_TESTS,
                PermissionEnum.VIEW_TEST_RESULTS,
                PermissionEnum.UPDATE_TEST_RESULTS,
                PermissionEnum.PATIENT_READ
        ));

        EmployeeEntity labTech = new EmployeeEntity(
                "Lab",
                "Technician",
                "labtech@gmail.com",
                "+1888999000",
                "LAB001",
                GenderEnum.M,
                UserTypeEnum.LAB_TECHNICIAN,
                encoder.encode("LabTech@gmail.com1"),
                LocalDate.of(1990, 9, 15),
                3000.0f,
                labTechPermissions
        );
        labTech.setDepartment("Laboratory");
        labTech.setDescription("Medical Laboratory Technician specializing in blood work and diagnostics");
        userRepository.save(labTech);
    }
}