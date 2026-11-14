package com.reboistn.coursegroup.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Données pour créer ou modifier un cours")
public record CourseRequest(
        @Schema(example = "AMS-4", description = "Code unique du cours")
        @NotBlank @Size(max = 20) String code,

        @Schema(example = "Architecture microservices")
        @NotBlank @Size(max = 150) String name,

        @Schema(example = "Conception et déploiement d'architectures distribuées")
        @Size(max = 1000) String description,

        @Schema(example = "4ème année")
        @Size(max = 50) String level) {
}
