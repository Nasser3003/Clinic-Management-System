package com.almoatasem.demo;

import com.almoatasem.demo.service.UserService;
import com.almoatasem.demo.utils.Generics;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;




@SpringBootApplication
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}




	@Bean
	CommandLineRunner commandLineRunner(UserService userService, Generics generics) {


		return args -> {
			userService.saveUser("Almoatasem", "Ahmed", "mo3a222@gmail.com",
					"1991-11-15", "MALE");
			userService.saveUser("Almoatasem", "Ahmed", "mo3a12@gmail.com",
					"1961-10-10", "MALE");
			userService.saveUser("Almoatasem", "Ahmed", "mo3a2422@gmail.com",
					"1921-12-05", "MALE");

			generics.printList(userService.selectAllUsers());
		};
	}
}