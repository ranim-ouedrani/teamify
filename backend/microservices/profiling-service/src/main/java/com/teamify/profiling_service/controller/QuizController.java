package com.teamify.profiling_service.controller;

import com.teamify.profiling_service.dto.Dto.QuizCreateRequest;
import com.teamify.profiling_service.dto.Dto.QuizResponse;
import com.teamify.profiling_service.dto.Dto.SoumissionRequest;
import com.teamify.profiling_service.dto.Dto.ValidationRequest;
import com.teamify.profiling_service.service.QuizService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@Tag(name = "Quiz")
public class QuizController {

    private final QuizService quizService;

    // --- Enseignant ---

    @Operation(summary = "Créer un quiz pour un étudiant (enseignant)")
    @PostMapping("/enseignants/{enseignantId}/quiz")
    @ResponseStatus(HttpStatus.CREATED)
    public QuizResponse creer(@PathVariable UUID enseignantId, @Valid @RequestBody QuizCreateRequest req) {
        return quizService.creer(enseignantId, req);
    }

    @Operation(summary = "Lister les quiz en attente de validation (enseignant)")
    @GetMapping("/enseignants/{enseignantId}/quiz/a-valider")
    public List<QuizResponse> aValider(@PathVariable UUID enseignantId) {
        return quizService.aValider(enseignantId);
    }

    @Operation(summary = "Valider ou refuser un quiz : certifie les compétences liées (enseignant)")
    @PostMapping("/quiz/{quizId}/validation")
    public QuizResponse valider(@PathVariable UUID quizId, @Valid @RequestBody ValidationRequest req) {
        return quizService.valider(quizId, req);
    }

    // --- Étudiant ---

    @Operation(summary = "Lister les quiz d'un étudiant (sans les bonnes réponses)")
    @GetMapping("/etudiants/{etudiantId}/quiz")
    public List<QuizResponse> quizDeLEtudiant(@PathVariable UUID etudiantId) {
        return quizService.quizDeLEtudiant(etudiantId);
    }

    @Operation(summary = "Passer un quiz : score calculé sur 20 (étudiant)")
    @PostMapping("/quiz/{quizId}/soumettre")
    public QuizResponse soumettre(@PathVariable UUID quizId, @Valid @RequestBody SoumissionRequest req) {
        return quizService.soumettre(quizId, req);
    }
}
