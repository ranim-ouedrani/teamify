package com.teamify.profiling_service.controller;

import com.teamify.profiling_service.dto.Dto.CompetenceRequest;
import com.teamify.profiling_service.dto.Dto.CompetenceResponse;
import com.teamify.profiling_service.dto.Dto.EtudiantResponse;
import com.teamify.profiling_service.dto.Dto.EtudiantUpdateRequest;
import com.teamify.profiling_service.service.EtudiantService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
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
import java.util.UUID;

@RestController
@RequestMapping("/api/etudiants")
@RequiredArgsConstructor
@Tag(name = "Étudiant")
public class EtudiantController {

    private final EtudiantService etudiantService;

    @Operation(summary = "Consulter le profil d'un étudiant")
    @GetMapping("/{id}")
    public EtudiantResponse get(@PathVariable UUID id) {
        return etudiantService.get(id);
    }

    @Operation(summary = "Modifier la bio et la photo")
    @PutMapping("/{id}")
    public EtudiantResponse modifier(@PathVariable UUID id, @Valid @RequestBody EtudiantUpdateRequest req) {
        return etudiantService.modifier(id, req);
    }

    @Operation(summary = "Lister toutes les compétences de l'étudiant")
    @GetMapping("/{id}/competences")
    public List<CompetenceResponse> competences(@PathVariable UUID id) {
        return etudiantService.competences(id);
    }

    @Operation(summary = "Lister les compétences certifiées (visibles par les autres)")
    @GetMapping("/{id}/competences/certifiees")
    public List<CompetenceResponse> competencesCertifiees(@PathVariable UUID id) {
        return etudiantService.competencesCertifiees(id);
    }

    @Operation(summary = "Déclarer une compétence (niveau 1 à 5)")
    @PostMapping("/{id}/competences")
    @ResponseStatus(HttpStatus.CREATED)
    public CompetenceResponse ajouterCompetence(@PathVariable UUID id, @Valid @RequestBody CompetenceRequest req) {
        return etudiantService.ajouterCompetence(id, req);
    }

    @Operation(summary = "Supprimer une compétence déclarée (non certifiée, sans quiz lié)")
    @DeleteMapping("/{id}/competences/{competenceId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void supprimerCompetence(@PathVariable UUID id, @PathVariable UUID competenceId) {
        etudiantService.supprimerCompetence(id, competenceId);
    }
}
