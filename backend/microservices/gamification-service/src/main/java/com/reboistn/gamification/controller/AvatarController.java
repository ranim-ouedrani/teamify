package com.reboistn.gamification.controller;

import com.reboistn.gamification.dto.AvatarRequest;
import com.reboistn.gamification.dto.AvatarResponse;
import com.reboistn.gamification.dto.ErrorResponse;
import com.reboistn.gamification.service.AvatarService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(value = "/avatars", produces = MediaType.APPLICATION_JSON_VALUE)
@Tag(name = "Avatars", description = "CRUD des avatars de gamification")
public class AvatarController {

    private final AvatarService avatarService;

    public AvatarController(AvatarService avatarService) {
        this.avatarService = avatarService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Ajouter un avatar",
            description = "Crée un nouvel avatar. L'id est généré automatiquement. "
                    + "Si 'actif' est absent, l'avatar est créé actif.")
    @ApiResponse(responseCode = "201", description = "Avatar créé",
            content = @Content(schema = @Schema(implementation = AvatarResponse.class)))
    @ApiResponse(responseCode = "400", description = "Données invalides (ex. nom vide)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public AvatarResponse create(@Valid @RequestBody AvatarRequest request) {
        return avatarService.create(request);
    }

    @GetMapping
    @Operation(summary = "Afficher la liste des avatars", description = "Retourne tous les avatars (actifs et inactifs).")
    @ApiResponse(responseCode = "200", description = "Liste des avatars (vide si aucun)",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = AvatarResponse.class))))
    public List<AvatarResponse> findAll() {
        return avatarService.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Afficher un avatar par son ID")
    @ApiResponse(responseCode = "200", description = "Avatar trouvé",
            content = @Content(schema = @Schema(implementation = AvatarResponse.class)))
    @ApiResponse(responseCode = "400", description = "Id invalide (non numérique)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Avatar introuvable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public AvatarResponse findById(
            @Parameter(description = "Identifiant de l'avatar", example = "1", required = true)
            @PathVariable Long id) {
        return avatarService.findById(id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @Operation(summary = "Modifier un avatar",
            description = "Remplace nom, imageUrl et categorie. Si 'actif' est absent, sa valeur actuelle est conservée.")
    @ApiResponse(responseCode = "200", description = "Avatar modifié",
            content = @Content(schema = @Schema(implementation = AvatarResponse.class)))
    @ApiResponse(responseCode = "400", description = "Données invalides ou id invalide",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Avatar introuvable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public AvatarResponse update(
            @Parameter(description = "Identifiant de l'avatar à modifier", example = "1", required = true)
            @PathVariable Long id,
            @Valid @RequestBody AvatarRequest request) {
        return avatarService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Supprimer un avatar")
    @ApiResponse(responseCode = "204", description = "Avatar supprimé (pas de contenu)", content = @Content)
    @ApiResponse(responseCode = "400", description = "Id invalide (non numérique)",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Avatar introuvable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    public void delete(
            @Parameter(description = "Identifiant de l'avatar à supprimer", example = "1", required = true)
            @PathVariable Long id) {
        avatarService.delete(id);
    }
}
