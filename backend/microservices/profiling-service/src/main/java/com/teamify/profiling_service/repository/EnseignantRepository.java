package com.teamify.profiling_service.repository;

import com.teamify.profiling_service.entity.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EnseignantRepository extends JpaRepository<Enseignant, UUID> {
}
