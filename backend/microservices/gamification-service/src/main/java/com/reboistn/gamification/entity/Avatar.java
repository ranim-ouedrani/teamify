package com.reboistn.gamification.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Avatar que l'étudiant peut choisir dans la plateforme de gamification.
 * Table MySQL : avatar (gamification_db).
 */
@Entity
@Table(name = "avatar")
public class Avatar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nom", nullable = false, length = 100)
    private String nom;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "categorie", length = 100)
    private String categorie;

    @Column(name = "actif", nullable = false)
    private boolean actif = true;

    public Avatar() {
    }

    public Avatar(String nom, String imageUrl, String categorie, boolean actif) {
        this.nom = nom;
        this.imageUrl = imageUrl;
        this.categorie = categorie;
        this.actif = actif;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getCategorie() {
        return categorie;
    }

    public void setCategorie(String categorie) {
        this.categorie = categorie;
    }

    public boolean isActif() {
        return actif;
    }

    public void setActif(boolean actif) {
        this.actif = actif;
    }
}
