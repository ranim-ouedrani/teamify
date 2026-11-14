package com.teamify.profiling_service.entity;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
public class Enseignant extends Utilisateur {

    @Column(name = "module_id")
    private String moduleId;

    @ElementCollection
    @CollectionTable(name = "enseignant_classes", joinColumns = @JoinColumn(name = "enseignant_id"))
    @Column(name = "class_id")
    private List<String> classIds = new ArrayList<>();

    // Champ visé par Administrateur.enseignants (mappedBy = "administrateur")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "administrateur_id")
    private Administrateur administrateur;
}
