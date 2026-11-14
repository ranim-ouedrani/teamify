package com.teamify.profiling_service.repository;

import com.teamify.profiling_service.entity.QuizEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QuizEvaluationRepository extends JpaRepository<QuizEvaluation, UUID> {

    List<QuizEvaluation> findByEtudiantId(UUID etudiantId);

    List<QuizEvaluation> findByEnseignantIdAndStatutValidation(UUID enseignantId, String statutValidation);
}
