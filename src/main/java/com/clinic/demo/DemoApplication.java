package com.clinic.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;


@SpringBootApplication
@EnableJpaAuditing
public class DemoApplication {
	// study crossOrigin and CascadeTypes. ALl Persist etc

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}