package org.rarbg.Project1;

import org.rarbg.Project1.Entities.UserInfo;
import org.rarbg.Project1.enums.GENDER;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Main {

	public static void main(String[] args) {
		SpringApplication.run(Main.class, args);

		UserInfo user1 = new UserInfo("Meem","Deep",
				"mdeep@gmail.com",new java.sql.Date(1999, 10, 2), GENDER.M);
	}
}