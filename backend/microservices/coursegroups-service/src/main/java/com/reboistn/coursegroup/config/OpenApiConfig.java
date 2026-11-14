package com.reboistn.coursegroup.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI courseGroupOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Course / Group Service API")
                .description("Microservice MS3 - gestion des cours, projets et groupes (Teamify)")
                .version("0.0.1"));
    }
}
