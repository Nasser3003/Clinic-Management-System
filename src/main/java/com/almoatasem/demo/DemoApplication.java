package com.almoatasem.demo;

import com.almoatasem.demo.models.entitiy.Role;
import com.almoatasem.demo.models.entitiy.UserInfo;
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

			Set<Role> roles = new HashSet<>();
			roles.add(createAdminRole);
			roles.add(createUserRole);


			UserInfo admin = new UserInfo("admin", "admin@gmail.com", encoder.encode("admin"), roles);
			userRepository.save(admin);

		};
	}
}