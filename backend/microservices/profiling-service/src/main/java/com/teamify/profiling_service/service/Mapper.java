package com.teamify.profiling_service.service;

import com.teamify.profiling_service.dto.Dto;
import com.teamify.profiling_service.entity.Competence;
import com.teamify.profiling_service.entity.Enseignant;
import com.teamify.profiling_service.entity.Etudiant;
import com.teamify.profiling_service.entity.QuizEvaluation;
import com.teamify.profiling_service.entity.Utilisateur;

import java.util.ArrayList;

final class Mapper {

    private Mapper() {
    }

    static Dto.UtilisateurResponse utilisateur(Utilisateur u) {
        return new Dto.UtilisateurResponse(u.getId(), u.getEmail(), u.getNom(), u.getPrenom(), u.getRole());
    }

    static Dto.EtudiantResponse etudiant(Etudiant e) {
        return new Dto.EtudiantResponse(e.getId(), e.getEmail(), e.getNom(), e.getPrenom(),
                e.getIdentifiant(), e.getGpa(), e.getPhoto(), e.getBio());
    }

    static Dto.CompetenceResponse competence(Competence c) {
        return new Dto.CompetenceResponse(c.getId(), c.getNom(), c.getNiveau(), c.getStatut());
    }

    static Dto.EnseignantResponse enseignant(Enseignant e) {
        return new Dto.EnseignantResponse(e.getId(), e.getEmail(), e.getNom(), e.getPrenom(),
                e.getModuleId(), new ArrayList<>(e.getClassIds()));
    }

    static Dto.QuizResponse quiz(QuizEvaluation q) {
        return new Dto.QuizResponse(
                q.getId(), q.getTitre(), q.getScoreObtenu(), q.getStatutValidation(),
                q.getEtudiant() == null ? null : q.getEtudiant().getId(),
                q.getEnseignant() == null ? null : q.getEnseignant().getId(),
                q.getCompetencesCertifiees().stream().map(Competence::getId).toList(),
                q.getQuestions().stream().map(x -> new Dto.QuestionView(x.getId(), x.getTexte())).toList());
    }
}
