package com.reboistn.gamification.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI gamificationOpenApi() {
        return new OpenAPI().info(new Info()
                .title("Gamification Service API")
                .description("Microservice de gamification (Teamify / ReboisTN) - CRUD des avatars")
                .version("0.0.1"));
    }
}
