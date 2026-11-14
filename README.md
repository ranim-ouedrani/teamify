# Teamify — Plateforme intelligente de constitution de groupes collaboratifs

**Une solution web distribuée pour former automatiquement des groupes d'apprentissage équilibrés et favoriser la collaboration entre étudiants.**

*Architecture Web Distribuée (AWD) · ESPRIT School of Engineering · 4ᵉ année Génie Informatique · 2026–2027*
---

## Présentation du projet

La **Plateforme de constitution automatique de groupes d'apprentissage collaboratif** est une application qui vise à faciliter la création de groupes de travail équilibrés et à améliorer la collaboration entre les étudiants.

La constitution manuelle des groupes peut être complexe pour les enseignants, notamment lorsqu'il faut prendre en considération les résultats académiques, les compétences, les centres d'intérêt et les disponibilités des étudiants.

Notre solution propose une plateforme intelligente qui exploite les profils des étudiants et des techniques de Machine Learning afin de faciliter la constitution automatique des groupes.

Au-delà de la formation des groupes, la plateforme accompagne les étudiants tout au long de leurs projets collaboratifs grâce à des fonctionnalités d'entraide, de communication, de feedback et de gamification.

---

## Objectifs du projet

Les principaux objectifs de la plateforme sont :

- Automatiser la constitution de groupes d'apprentissage collaboratif.
- Exploiter les profils des étudiants pour proposer des groupes équilibrés.
- Faciliter la gestion des modules, des projets et des groupes.
- Encourager l'entraide et le partage des connaissances entre étudiants.
- Améliorer la communication et les relations au sein des groupes.
- Recueillir des feedbacks afin d'évaluer la qualité de la collaboration.
- Motiver les étudiants grâce à un système de points et de récompenses.
- Fournir aux enseignants des outils de suivi et d'analyse.

---

## Architecture globale

L'application repose sur une **architecture orientée microservices**. Chaque microservice possède une responsabilité métier spécifique et gère ses propres fonctionnalités et données.

Cette organisation permet de séparer les différents domaines fonctionnels, de faciliter la maintenance et de faire évoluer les services indépendamment.

### Diagramme de l'architecture globale

Le diagramme suivant présente l'organisation des différents microservices et leurs interactions au sein de la plateforme.

![Architecture globale de la plateforme](documentation/diagrams/architecture-globale.png)

---

## Présentation des microservices

### MS1 — Authentification et Profiling

<badge color="info">Gestion des utilisateurs et des profils</badge>

Ce microservice assure la gestion des comptes utilisateurs, l'authentification et les profils des étudiants.

**Fonctionnalités principales :**

- Création et gestion des comptes.
- Authentification et gestion des rôles (étudiant, enseignant, administrateur).
- Gestion des informations personnelles.
- Gestion des résultats et du niveau académique.
- Gestion des compétences et des centres d'intérêt.
- Gestion des disponibilités et des préférences de collaboration.
- Questionnaire facultatif sur le style d'apprentissage.

**Technologies utilisées :** Spring Boot . PostgreSQL

---

### MS2 — Machine Learning

<badge color="info">Analyse intelligente des profils</badge>

Ce microservice est chargé d'analyser les profils des étudiants afin de fournir les informations nécessaires à la constitution automatique des groupes.

**Fonctionnalités principales :**

- Récupération des profils des étudiants.
- Nettoyage et préparation des données.
- Normalisation des notes et des compétences.
- Encodage des données catégorielles.
- Application de l'algorithme K-means pour identifier des profils similaires.
- Analyse des caractéristiques et des compétences des étudiants.
- Transmission des résultats au microservice de gestion des groupes.

**Technologies utilisées :** Django . PostgreSQL

---

### MS3 — Gestion des enseignants, modules et groupes

<badge color="info">Gestion pédagogique</badge>

Ce microservice permet aux enseignants d'organiser les activités pédagogiques et de gérer la constitution des groupes.

**Fonctionnalités principales :**

- Création et gestion des modules.
- Inscription des étudiants aux modules.
- Création et gestion des projets.
- Définition du nombre de groupes et de leur taille.
- Demande de génération automatique des groupes.
- Consultation des propositions de répartition.
- Modification manuelle des affectations.
- Validation et publication des groupes.
- Suivi des activités et des projets des groupes.

**Technologies utilisées :** Spring Boot . MySQL

---

### MS4 — Entraide et accompagnement entre étudiants

<badge color="info">Peer Help & Support</badge>

Ce microservice facilite l'entraide entre les étudiants en leur permettant de partager leurs connaissances et de s'accompagner mutuellement.

**Fonctionnalités principales :**

- Publication de demandes d'aide dans différentes matières.
- Identification des étudiants susceptibles de fournir de l'aide.
- Mise en relation entre les étudiants selon leurs compétences.
- Possibilité de proposer son aide à d'autres étudiants.
- Organisation de séances d'entraide et de tutorat.
- Suivi des demandes et de leur statut.

**Technologies utilisées :** Spring Boot . MySQL

---

### MS5 — Feedback et vie sociale

<badge color="info">Collaboration et interaction sociale</badge>

Ce microservice vise à améliorer les relations entre les membres des groupes et à favoriser un environnement de collaboration positif.

**Fonctionnalités principales :**

- Formulaires de feedback périodiques.
- Évaluation de la communication, de la participation, des responsabilités, de l'entraide et de l'ambiance générale.
- Publication de commentaires et de suggestions.
- Discussions collectives entre les membres des groupes.
- Messagerie privée entre étudiants.
- Proposition d'activités collectives.
- Signalement des difficultés relationnelles ou des contenus inappropriés.
- Consultation des feedbacks et suivi des signalements par les enseignants autorisés.

**Technologies utilisées :** Spring Boot . PostgreSQL

---

### MS6 — Gamification

<badge color="info">Motivation et récompenses</badge>

Ce microservice vise à encourager la participation, l'entraide et l'engagement des étudiants grâce à des mécanismes de gamification.

**Fonctionnalités principales :**

- Attribution de points selon les actions réalisées.
- Gestion des badges et des récompenses.
- Suivi des achievements individuels et collectifs.
- Classements des étudiants et des équipes.
- Valorisation de l'entraide et de la participation.
- Suivi des performances liées à la gamification.

**Technologies utilisées :** Spring Boot . MySQL

---
### MS6 — Analytics Service

<badge color="discovery">Pilotage et statistiques</badge>

Ce microservice est chargé de l'analyse des données et du suivi des performances des groupes d'apprentissage collaboratif. Il permet à l'enseignant de consulter des statistiques pour évaluer la composition et la progression des groupes.

**Fonctionnalités principales :**

- Mise à disposition d'un tableau de bord pour l'enseignant.
- Comparaison des moyennes des différents groupes.
- Visualisation de la diversité des compétences.
- Suivi des statistiques de participation.
- Suivi de la progression des équipes.
- Comparaison des résultats avec une répartition aléatoire des groupes.

**Technologies utilisées :** Python, MongoDB.

---
## Principes architecturaux

L'architecture du projet s'appuie sur plusieurs principes fondamentaux des microservices :

- **Database per Service :** chaque microservice possède sa propre base de données.
- **Faible couplage :** les services sont indépendants et communiquent à travers des interfaces définies.
- **Communication interservices :** les échanges s'effectuent à travers des mécanismes de communication adaptés aux besoins fonctionnels.
- **Responsabilité métier :** chaque microservice est responsable d'un domaine fonctionnel précis.
- **Déploiement indépendant :** les services peuvent évoluer et être déployés séparément.
- **Séparation des responsabilités :** les fonctionnalités communes sont distinguées des fonctionnalités métier.

---

## Structure du dépôt Git

L'organisation proposée du dépôt est la suivante :

```text
Teamify_4DASi10_g3/
│
├── backend/
│   ├── .idea/
│   ├── microservices/
│   │   └──  MS1-Authentication-Profiling/
│   │   └──  MS2-Machine-Learning/
│   │   └──  MS3-Course-Group-Management/
│   │   └──  MS4-Peer-Help/
│   │   └──  MS5-Feedback-Social-Life/
│   │   └──  MS6-Gamification/
│   │   └──  MS7-Common-Services/
├── documentation/
│   ├── diagrams/
│   │   └── architecture-globale.png
│   │   └── diagramme-classe.png
│   │   └── diagramme-classe-domaine.png
│   └── presentation/
├── frontend/
└── README.md
```

## Installation et exécution

### Prérequis

Les outils nécessaires dépendent des technologies utilisées dans chaque microservice.

Les principaux prérequis peuvent inclure :

- Git
- Node.js et npm
- Java JDK
- Python
- Docker et Docker Compose
- Les systèmes de gestion de bases de données utilisés par les services

### Cloner le dépôt

```bash
git clone <repository-url>
cd Collaborative-Learning-Platform
```

### Exécution

Chaque microservice possède ses propres paramètres de configuration et ses instructions d'installation et d'exécution.

Les composants communs et les bases de données nécessaires doivent être configurés avant le démarrage des services qui en dépendent.

Les instructions détaillées seront ajoutées dans les répertoires correspondants.

---

## Documentation

Le répertoire `documentation/` regroupe les documents relatifs à la conception et à l'architecture du projet :

- Diagramme global de l'architecture.
- Diagrammes de classes.
- - Diagrammes de classes domaine.
- Documentation des interactions entre microservices.

---

## Contexte académique

**Établissement :** ESPRIT School of Engineering

**Module :** Architecture Web Distribuée (AWD)

**Niveau :** 4ᵉ année Génie Informatique

**Année universitaire :** 2026–2027

---

## Équipe du projet

| Membre | Responsabilité |
|---|---|
| Oussema Fattoumi | MS1 — Authentification et Profiling |
| Ranim Oudrani | MS2 — Machine Learning |
| Oussama jarraya | MS3 — Gestion des enseignants, modules et groupes |
| Rayen Houioui | MS4 — Entraide et accompagnement entre étudiants |
| Tasnim Hattab | MS5 — Feedback et vie sociale |
| Rim Borchani | MS6 — Gamification |

---

<div align="center">

**Plateforme de constitution automatique de groupes d'apprentissage collaboratif**

*Former des groupes équilibrés, encourager l'entraide et améliorer la collaboration.*

</div>
