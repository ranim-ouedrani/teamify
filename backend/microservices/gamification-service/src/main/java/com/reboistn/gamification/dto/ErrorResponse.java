package com.reboistn.gamification.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.Instant;
import java.util.Map;

@Schema(name = "ErrorResponse", description = "Réponse d'erreur standard de l'API")
public record ErrorResponse(

        @Schema(description = "Date et heure de l'erreur (UTC)", example = "2026-11-11T10:15:30Z")
        Instant timestamp,

        @Schema(description = "Code HTTP", example = "404")
        int status,

        @Schema(description = "Libellé du statut HTTP", example = "Not Found")
        String error,

        @Schema(description = "Message explicatif", example = "Avatar introuvable avec l'id 42")
        String message,

        @Schema(description = "Erreurs par champ (uniquement pour les erreurs de validation)",
                example = "{\"nom\": \"Le nom est obligatoire\"}")
        Map<String, String> fieldErrors
) {
}
