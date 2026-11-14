package com.teamify.profiling_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Administrateur extends Utilisateur {

    // "administrateur" = nom du champ dans Enseignant
    @OneToMany(mappedBy = "administrateur")
    private List<Enseignant> enseignants = new ArrayList<>();

    // "administrateur" = nom du champ dans Etudiant
    @OneToMany(mappedBy = "administrateur")
    private List<Etudiant> etudiants = new ArrayList<>();
}
