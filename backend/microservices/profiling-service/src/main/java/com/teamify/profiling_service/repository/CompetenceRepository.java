package com.teamify.profiling_service.repository;

import com.teamify.profiling_service.entity.Competence;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CompetenceRepository extends JpaRepository<Competence, UUID> {

    List<Competence> findByEtudiantId(UUID etudiantId);

    List<Competence> findByEtudiantIdAndStatut(UUID etudiantId, String statut);
}
