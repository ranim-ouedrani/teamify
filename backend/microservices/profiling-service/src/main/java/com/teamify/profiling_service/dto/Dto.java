package com.teamify.profiling_service.dto;

import com.teamify.profiling_service.entity.Role;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;
import java.util.Map;
import java.util.UUID;

public final class Dto {

    private Dto() {
    }

    // ---------- Utilisateurs ----------
    public record UtilisateurResponse(UUID id, String email, String nom, String prenom, Role role) {
    }

    // ---------- Étudiant ----------
    public record EtudiantResponse(UUID id, String email, String nom, String prenom,
                                   String identifiant, double gpa, String photo, String bio) {
    }

    public record EtudiantUpdateRequest(@Size(max = 1000) String bio,
                                        @Size(max = 255) String photo) {
    }

    // ---------- Compétences ----------
    public record CompetenceRequest(@NotBlank String nom,
                                    @Min(1) @Max(5) int niveau) {
    }

    public record CompetenceResponse(UUID id, String nom, int niveau, String statut) {
    }

    // ---------- Enseignant ----------
    public record EnseignantRequest(@NotBlank @Email String email,
                                    @NotBlank String nom,
                                    @NotBlank String prenom,
                                    String moduleId,
                                    List<String> classIds) {
    }

    public record AffectationRequest(@NotBlank String moduleId, List<String> classIds) {
    }

    public record EnseignantResponse(UUID id, String email, String nom, String prenom,
                                     String moduleId, List<String> classIds) {
    }

    // ---------- Import CSV ----------
    public record ImportReport(int lignesLues, int importees, int rejetees, List<String> erreurs) {
    }

    // ---------- Quiz ----------
    public record QuestionRequest(@NotBlank String texte, @NotBlank String reponseCorrecte) {
    }

    public record QuizCreateRequest(@NotBlank String titre,
                                    @NotNull UUID etudiantId,
                                    @NotEmpty List<UUID> competenceIds,
                                    @NotEmpty @Valid List<QuestionRequest> questions) {
    }

    /** Vue d'une question pour l'étudiant : sans la bonne réponse. */
    public record QuestionView(UUID id, String texte) {
    }

    public record QuizResponse(UUID id, String titre, double scoreObtenu, String statutValidation,
                               UUID etudiantId, UUID enseignantId,
                               List<UUID> competenceIds, List<QuestionView> questions) {
    }

    public record SoumissionRequest(@NotNull UUID etudiantId,
                                    @NotEmpty Map<UUID, String> reponses) {
    }

    public record ValidationRequest(@NotNull UUID enseignantId, @NotNull Boolean valide) {
    }
}
