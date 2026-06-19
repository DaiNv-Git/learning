package com.smartlearning.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan(basePackages = "com.smartlearning.backend.model")
@EnableJpaRepositories(basePackages = "com.smartlearning.backend.repository")
@ComponentScan(
		basePackages = "com.smartlearning.backend",
		excludeFilters = {
				@ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.smartlearning\\.backend\\.presentation\\..*"),
				@ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.smartlearning\\.backend\\.infrastructure\\.security\\..*"),
				@ComponentScan.Filter(type = FilterType.REGEX, pattern = "com\\.smartlearning\\.backend\\.core\\..*")
		}
)
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

}
