package com.teamify.profiling_service.controller;

import com.teamify.profiling_service.dto.Dto.AffectationRequest;
import com.teamify.profiling_service.dto.Dto.EnseignantRequest;
import com.teamify.profiling_service.dto.Dto.EnseignantResponse;
import com.teamify.profiling_service.dto.Dto.ImportReport;
import com.teamify.profiling_service.dto.Dto.UtilisateurResponse;
import com.teamify.profiling_service.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Tag(name = "Administrateur")
public class AdminController {

    private final AdminService adminService;

    @Operation(summary = "Importer le CSV des étudiants (email;nom;prenom;identifiant;gpa)")
    @PostMapping(value = "/etudiants/import", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ImportReport importerEtudiants(@RequestParam("file") MultipartFile file) {
        return adminService.importerEtudiants(file);
    }

    @Operation(summary = "Créer un compte enseignant")
    @PostMapping("/enseignants")
    @ResponseStatus(HttpStatus.CREATED)
    public EnseignantResponse creerEnseignant(@Valid @RequestBody EnseignantRequest req) {
        return adminService.creerEnseignant(req);
    }

    @Operation(summary = "Affecter un module et des classes à un enseignant")
    @PutMapping("/enseignants/{id}/affectation")
    public EnseignantResponse affecter(@PathVariable UUID id, @Valid @RequestBody AffectationRequest req) {
        return adminService.affecter(id, req);
    }

    @Operation(summary = "Lister les enseignants")
    @GetMapping("/enseignants")
    public List<EnseignantResponse> enseignants() {
        return adminService.listerEnseignants();
    }

    @Operation(summary = "Lister tous les comptes")
    @GetMapping("/utilisateurs")
    public List<UtilisateurResponse> utilisateurs() {
        return adminService.listerUtilisateurs();
    }
}
