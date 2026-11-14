# MS5 — Feedback et vie sociale
## 1. Description

Le microservice MS5 est chargé de la gestion des retours d'expérience et des interactions sociales au sein de la plateforme Teamify, dédiée à la constitution automatique de groupes d'apprentissage collaboratif.

Il centralise les évaluations des étudiants concernant leurs expériences de collaboration, facilite les interactions sociales entre les membres des groupes et permet de signaler les problèmes rencontrés, notamment les conflits relationnels ou les contenus inappropriés.

Le microservice repose sur trois entités principales :

- **Feedback :** Permet aux étudiants d'évaluer leur expérience collaborative selon plusieurs critères : communication, participation, responsabilité, entraide et ambiance du groupe.
- **InteractionSociale :** Gère les interactions entre étudiants, notamment les discussions, les messages, les suggestions et les activités.
- **Rapport :** Permet de signaler les difficultés relationnelles ou les contenus inappropriés, tout en assurant le suivi et la modération des signalements.

Le service utilise les identifiants des étudiants et des groupes pour assurer l'intégration avec les autres microservices, sans dupliquer leurs données.


## 2. Technologies utilisées

- **Langage de programmation :** Java 17 (Amazon Corretto 17.0.20)
- **Framework :** Spring Boot
- **Base de données :** PostgreSQL
- **ORM / Persistance :** Spring Data JPA, Hibernate
- **Outil de construction :** Maven
- **Documentation API :** Swagger / OpenAPI (Springdoc)
  Swagger UI: http://localhost:8084/swagger-ui/index.html


## 3. Structure du projet
```text
tn.esprit.ms5
├── config       SwaggerConfig 
├── controller   FeedbackController
├── dto          request/response 
├── entity       Feedback, InteractionSociale, Rapport
├── exception    GlobalExceptionHandler, ResourceNotFoundException, ConflictException
├── mapper       FeedbackMapper
├── repository   FeedbackRepository
└── service      FeedbackService
```

## 4. Installation et configuration

### Prérequis

- Java JDK 17
- Apache Maven
- PostgreSQL
- IntelliJ IDEA ou un autre environnement de développement Java

- 
### Installation

Cloner le dépôt Git :

```bash
git clone <repository-url>
cd MS5
```

Construire le projet :

```bash
mvn clean install
```

### Lancement du microservice

Exécuter la commande suivante :

```bash
mvn spring-boot:run
```

Le microservice est accessible sur le port **8084**.


## 5. Points d'accès API

### Gestion des Feedbacks

| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/feedback/AddFeedback` | Ajouter un feedback |
| GET | `/feedback/listFeedbacks` | Récupérer tous les feedbacks |
| GET | `/feedback/retrieveFeedback/{idF}` | Récupérer un feedback par son identifiant |
| PUT | `/feedback/UpdateFeedback` | Modifier un feedback |
| DELETE | `/feedback/DeleteFeedback/{idF}` | Supprimer un feedback |
| POST | `/feedback/addFeedbacks` | Ajouter plusieurs feedbacks |


## 6. Base de données

- **Type de base de données :** PostgreSQL
- **Nom de la base de données :** ms5 (à adapter selon la configuration réelle)
- **Principales entités / tables :**

| Entité | Informations principales |
|---|---|
| Feedback | Identifiant étudiant, identifiant groupe, critères d'évaluation, commentaire, confidentialité, date de création |
| InteractionSociale | Identifiant étudiant, identifiant groupe, type, titre, contenu, date de création, statut |
| Rapport | Déclarant, étudiant/groupe concerné, type de signalement, description, statut, informations de modération |

