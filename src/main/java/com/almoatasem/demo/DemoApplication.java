package com.almoatasem.demo;

import com.almoatasem.demo.models.entitiy.Role;
import com.almoatasem.demo.models.entitiy.user.Doctor;
import com.almoatasem.demo.models.entitiy.user.Patient;
import com.almoatasem.demo.models.entitiy.user.UserInfo;
import com.almoatasem.demo.repository.RoleRepository;
import com.almoatasem.demo.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Set;


@SpringBootApplication
@EnableJpaAuditing
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner runner(RoleRepository roleRepository, UserRepository userRepository, PasswordEncoder encoder) {
		return args -> {
			if (roleRepository.findByAuthority("ADMIN").isPresent()) return;

			Role createAdminRole = roleRepository.save(new Role("ADMIN"));
			Role createUserRole = roleRepository.save(new Role("USER"));
			Role createPatientRole= roleRepository.save(new Role("PATIENT"));
			Role createDoctorRole= roleRepository.save(new Role("DOCTOR"));


			Set<Role> rolesAdminDoctor = new HashSet<>(); rolesAdminDoctor.add(createAdminRole);
			rolesAdminDoctor.add(createDoctorRole);
			rolesAdminDoctor.add(createUserRole);

			Set<Role> rolesPatient = new HashSet<>();
			rolesPatient.add(createPatientRole);
			rolesPatient.add(createUserRole);

			Doctor docter1 = new Doctor("DoctorAdmin", "DoctorAdmin@gmail.com", encoder.encode("admin"),
					rolesAdminDoctor, 30_000);
			Patient patient1 = new Patient("PatientUser", "PatientUser@gmail.com", encoder.encode("user"),
					rolesPatient);
			userRepository.save(docter1);
			userRepository.save(patient1);
			patient1.setDoctor(docter1);
			patient1.setFirstName("Patient1111111");
			docter1.addPatient(patient1);
			docter1.setFirstName("Doctor1111111");

			System.out.println(patient1);
			System.out.println(docter1);

		};
	}
}