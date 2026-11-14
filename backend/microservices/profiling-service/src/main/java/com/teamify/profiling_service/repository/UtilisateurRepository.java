package com.teamify.profiling_service.repository;

import com.teamify.profiling_service.entity.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface UtilisateurRepository extends JpaRepository<Utilisateur, UUID> {

    boolean existsByEmailIgnoreCase(String email);

    Optional<Utilisateur> findByEmailIgnoreCase(String email);
}
