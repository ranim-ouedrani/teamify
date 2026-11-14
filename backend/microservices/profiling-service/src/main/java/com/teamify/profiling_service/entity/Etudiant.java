package com.teamify.profiling_service.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Etudiant extends Utilisateur {

    @Column(nullable = false, unique = true)
    private String identifiant;

    private double gpa;

    @Column(length = 255)
    private String photo;

    @Column(length = 1000)
    private String bio;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Competence> competences = new ArrayList<>();

    // Champ visé par Administrateur.etudiants (mappedBy = "administrateur")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur;
}
