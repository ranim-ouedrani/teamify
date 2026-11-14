package com.teamify.profiling_service.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import io.swagger.v3.oas.models.tags.Tag;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI profilingOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Teamify - Profiling Service")
                        .version("1.0.0")
                        .description("API de profilage : import des étudiants, compétences, quiz et certification.")
                        .contact(new Contact().name("Équipe Teamify")))
                .servers(List.of(new Server().url("http://localhost:8082").description("Local")))
                .tags(List.of(
                        new Tag().name("Administrateur").description("Import CSV, gestion des enseignants et des comptes"),
                        new Tag().name("Étudiant").description("Profil et compétences de l'étudiant"),
                        new Tag().name("Quiz").description("Création, passage et validation des quiz")));
    }
}
