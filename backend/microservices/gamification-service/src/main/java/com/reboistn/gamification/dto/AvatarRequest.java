package com.reboistn.gamification.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(name = "AvatarRequest", description = "Données à envoyer pour créer ou modifier un avatar")
public record AvatarRequest(

        @Schema(description = "Nom de l'avatar", example = "Renard curieux", requiredMode = Schema.RequiredMode.REQUIRED)
        @NotBlank(message = "Le nom est obligatoire")
        @Size(max = 100, message = "Le nom ne doit pas dépasser 100 caractères")
        String nom,

        @Schema(description = "URL de l'image de l'avatar", example = "https://exemple.com/avatars/renard.png")
        @Size(max = 500, message = "L'URL de l'image ne doit pas dépasser 500 caractères")
        String imageUrl,

        @Schema(description = "Catégorie de l'avatar", example = "Animaux")
        @Size(max = 100, message = "La catégorie ne doit pas dépasser 100 caractères")
        String categorie,

        @Schema(description = "Avatar actif (sélectionnable) ou non. "
                + "À la création : true par défaut si absent. À la modification : valeur inchangée si absent.",
                example = "true")
        Boolean actif
) {
}
