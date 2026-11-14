package com.teamify.profiling_service.repository;

import com.teamify.profiling_service.entity.Etudiant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EtudiantRepository extends JpaRepository<Etudiant, UUID> {

    boolean existsByIdentifiant(String identifiant);

    Optional<Etudiant> findByIdentifiant(String identifiant);
}
