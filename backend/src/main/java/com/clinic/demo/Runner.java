package com.clinic.demo;

import com.clinic.demo.models.entity.AppointmentEntity;
import com.clinic.demo.models.entity.user.AdminEntity;
import com.clinic.demo.models.entity.user.EmployeeEntity;
import com.clinic.demo.models.entity.user.PatientEntity;
import com.clinic.demo.models.enums.AppointmentStatus;
import com.clinic.demo.models.enums.GenderEnum;
import com.clinic.demo.models.enums.PermissionEnum;
import com.clinic.demo.models.enums.UserTypeEnum;
import com.clinic.demo.repository.AppointmentRepository;
import com.clinic.demo.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@NoArgsConstructor
@AllArgsConstructor(onConstructor = @__(@Autowired))
@Component
@Transactional
public class Runner implements CommandLineRunner {
    private UserRepository userRepository;
    private AppointmentRepository appointmentRepository;
    private PasswordEncoder encoder;

    @Override
    public void run(String... args) {
        // Check if admin user already exists to avoid duplicates
        if (userRepository.findByEmail("admin1@gmail.com").isPresent()) {
            System.out.println("Data already initialized, skipping...");
            return;
        }

        System.out.println("Initializing data...");

        // Create users first
        createUsers();

        // Create sample appointments
        createSampleAppointments();

        System.out.println("Data initialization completed successfully!");
        printUserCredentials();
    }

    private void createUsers() {
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
        createAdditionalDoctorsAndPatients();
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

    private void createAdditionalDoctorsAndPatients() {
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

        Set<PermissionEnum> patientPermissions = new HashSet<>(Set.of(
                PermissionEnum.PATIENT_READ_OWN,
                PermissionEnum.MEDICAL_RECORD_READ_OWN,
                PermissionEnum.APPOINTMENT_READ_OWN,
                PermissionEnum.APPOINTMENT_CREATE
        ));

        // Additional Doctor
        EmployeeEntity doctor2 = new EmployeeEntity(
                "Emma",
                "Smith",
                "emma.smith@clinic.com",
                "+1234567891",
                "DOC789012",
                GenderEnum.F,
                UserTypeEnum.DOCTOR,
                encoder.encode("Emma.smith123"),
                LocalDate.of(1982, 9, 22),
                5500.0f,
                doctorPermissions
        );
        doctor2.setTitle("Dr.");
        doctor2.setDepartment("Pediatrics");
        doctor2.setDescription("Pediatrician specializing in child healthcare");
        userRepository.save(doctor2);

        // Additional Patients
        PatientEntity patient2 = new PatientEntity(
                "John",
                "Doe",
                "john.doe@example.com",
                "+1987654321",
                GenderEnum.M,
                encoder.encode("John.doe123"),
                LocalDate.of(1985, 6, 15),
                patientPermissions
        );
        userRepository.save(patient2);

        PatientEntity patient3 = new PatientEntity(
                "Jane",
                "Wilson",
                "jane.wilson@example.com",
                "+1876543210",
                GenderEnum.F,
                encoder.encode("Jane.wilson123"),
                LocalDate.of(1978, 12, 3),
                patientPermissions
        );
        userRepository.save(patient3);

        PatientEntity patient4 = new PatientEntity(
                "Mike",
                "Johnson",
                "mike.johnson@example.com",
                "+1765432109",
                GenderEnum.M,
                encoder.encode("Mike.johnson123"),
                LocalDate.of(1995, 4, 18),
                patientPermissions
        );
        userRepository.save(patient4);
    }

    private void createSampleAppointments() {
        // Get saved users for appointments
        EmployeeEntity doctor1 = (EmployeeEntity) userRepository.findByEmail("doctor@gmail.com").orElseThrow();
        EmployeeEntity doctor2 = (EmployeeEntity) userRepository.findByEmail("emma.smith@clinic.com").orElseThrow();
        PatientEntity patient1 = (PatientEntity) userRepository.findByEmail("abdo.abdo3003@gmail.com").orElseThrow();
        PatientEntity patient2 = (PatientEntity) userRepository.findByEmail("john.doe@example.com").orElseThrow();
        PatientEntity patient3 = (PatientEntity) userRepository.findByEmail("jane.wilson@example.com").orElseThrow();
        PatientEntity patient4 = (PatientEntity) userRepository.findByEmail("mike.johnson@example.com").orElseThrow();

        // Past appointments (completed)
        AppointmentEntity appointment1 = new AppointmentEntity(
                doctor1, patient1,
                LocalDateTime.now().minusDays(7).withHour(10).withMinute(0).withSecond(0),
                60, "asasdda"
        );
        appointment1.setEndDateTime(appointment1.getStartDateTime().plusMinutes(60));
        appointment1.setStatus(AppointmentStatus.COMPLETED);
        appointment1.setReason("Regular checkup and blood pressure monitoring");
        appointmentRepository.save(appointment1);

        AppointmentEntity appointment2 = new AppointmentEntity(
                doctor2, patient2,
                LocalDateTime.now().minusDays(5).withHour(14).withMinute(30).withSecond(0),
                45, "asasdda"
        );
        appointment2.setEndDateTime(appointment2.getStartDateTime().plusMinutes(45));
        appointment2.setStatus(AppointmentStatus.COMPLETED);
        appointment2.setReason("Follow-up consultation for diabetes management");
        appointmentRepository.save(appointment2);

        AppointmentEntity appointment3 = new AppointmentEntity(
                doctor1, patient3,
                LocalDateTime.now().minusDays(3).withHour(9).withMinute(15).withSecond(0),
                30, "asasdda"
        );
        appointment3.setEndDateTime(appointment3.getStartDateTime().plusMinutes(30));
        appointment3.setStatus(AppointmentStatus.COMPLETED);
        appointment3.setReason("Annual physical examination");
        appointmentRepository.save(appointment3);

        // Current/Future appointments (scheduled)
        AppointmentEntity appointment4 = new AppointmentEntity(
                doctor1, patient1,
                LocalDateTime.now().plusDays(2).withHour(11).withMinute(0).withSecond(0),
                60, "asasdda"
        );
        appointment4.setEndDateTime(appointment4.getStartDateTime().plusMinutes(60));
        appointment4.setStatus(AppointmentStatus.SCHEDULED);
        appointment4.setReason("Cardiology consultation - chest pain evaluation");
        appointmentRepository.save(appointment4);

        AppointmentEntity appointment5 = new AppointmentEntity(
                doctor2, patient4,
                LocalDateTime.now().plusDays(3).withHour(15).withMinute(0).withSecond(0),
                90, "asasdda"
        );
        appointment5.setEndDateTime(appointment5.getStartDateTime().plusMinutes(90));
        appointment5.setStatus(AppointmentStatus.SCHEDULED);
        appointment5.setReason("Comprehensive health assessment for new patient");
        appointmentRepository.save(appointment5);

        AppointmentEntity appointment6 = new AppointmentEntity(
                doctor1, patient2,
                LocalDateTime.now().plusDays(5).withHour(8).withMinute(30).withSecond(0),
                45, "asasdda"
        );
        appointment6.setEndDateTime(appointment6.getStartDateTime().plusMinutes(45));
        appointment6.setStatus(AppointmentStatus.SCHEDULED);
        appointment6.setReason("Hypertension monitoring and medication review");
        appointmentRepository.save(appointment6);

        AppointmentEntity appointment7 = new AppointmentEntity(
                doctor2, patient3,
                LocalDateTime.now().plusDays(7).withHour(13).withMinute(45).withSecond(0),
                60, "asasdda"
        );
        appointment7.setEndDateTime(appointment7.getStartDateTime().plusMinutes(60));
        appointment7.setStatus(AppointmentStatus.SCHEDULED);
        appointment7.setReason("Routine pediatric checkup and vaccinations");
        appointmentRepository.save(appointment7);

        // Some canceled appointments
        AppointmentEntity appointment8 = new AppointmentEntity(
                doctor1, patient4,
                LocalDateTime.now().minusDays(1).withHour(16).withMinute(0).withSecond(0),
                30, "asasdda"
        );
        appointment8.setEndDateTime(appointment8.getStartDateTime().plusMinutes(30));
        appointment8.setStatus(AppointmentStatus.CANCELED);
        appointment8.setReason("Emergency consultation - patient canceled due to work conflict");
        appointmentRepository.save(appointment8);

        AppointmentEntity appointment9 = new AppointmentEntity(
                doctor2, patient1,
                LocalDateTime.now().plusDays(1).withHour(12).withMinute(0).withSecond(0),
                75, "asasdda"
        );
        appointment9.setEndDateTime(appointment9.getStartDateTime().plusMinutes(75));
        appointment9.setStatus(AppointmentStatus.SCHEDULED);
        appointment9.setReason("Specialist referral consultation for cardiac symptoms");
        appointmentRepository.save(appointment9);

        AppointmentEntity appointment10 = new AppointmentEntity(
                doctor1, patient3,
                LocalDateTime.now().plusDays(10).withHour(10).withMinute(30).withSecond(0),
                60, "asasdda"
        );
        appointment10.setEndDateTime(appointment10.getStartDateTime().plusMinutes(60));
        appointment10.setStatus(AppointmentStatus.SCHEDULED);
        appointment10.setReason("Follow-up after lab results review");
        appointmentRepository.save(appointment10);

        System.out.println("Created 10 sample appointments with various statuses and dates");
    }

    private void printUserCredentials() {
        System.out.println("Users created:");
        System.out.println("- Admin: admin1@gmail.com / Admin1@gmail.com");
        System.out.println("- Doctor (Cardiology): doctor@gmail.com / Doctor@gmail.com1");
        System.out.println("- Doctor (Pediatrics): emma.smith@clinic.com / Emma.smith123");
        System.out.println("- Patient 1: abdo.abdo3003@gmail.com / Abdo.abdo3003@gmail.com1");
        System.out.println("- Patient 2: john.doe@example.com / John.doe123");
        System.out.println("- Patient 3: jane.wilson@example.com / Jane.wilson123");
        System.out.println("- Patient 4: mike.johnson@example.com / Mike.johnson123");
        System.out.println("- Nurse: nurse@gmail.com / Nurse@gmail.com1");
        System.out.println("- Receptionist: receptionist@gmail.com / Receptionist@gmail.com1");
        System.out.println("- Lab Tech: labtech@gmail.com / LabTech@gmail.com1");
    }
}