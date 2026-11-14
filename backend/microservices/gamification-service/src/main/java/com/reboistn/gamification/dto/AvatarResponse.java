package com.reboistn.gamification.dto;

import com.reboistn.gamification.entity.Avatar;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(name = "AvatarResponse", description = "Avatar tel que renvoyé par l'API")
public record AvatarResponse(

        @Schema(description = "Identifiant généré automatiquement", example = "1")
        Long id,

        @Schema(description = "Nom de l'avatar", example = "Renard curieux")
        String nom,

        @Schema(description = "URL de l'image de l'avatar", example = "https://exemple.com/avatars/renard.png")
        String imageUrl,

        @Schema(description = "Catégorie de l'avatar", example = "Animaux")
        String categorie,

        @Schema(description = "Avatar actif ou non", example = "true")
        boolean actif
) {

    public static AvatarResponse from(Avatar avatar) {
        return new AvatarResponse(
                avatar.getId(),
                avatar.getNom(),
                avatar.getImageUrl(),
                avatar.getCategorie(),
                avatar.isActif());
    }
}
