# Microservice SkillExchange

## 1. Description
Ce microservice gère l'échange de compétences entre étudiants. Un étudiant fait une demande : la compétence qu'il veut apprendre et celle qu'il propose en échange. Le service l'associe à un autre étudiant, ils organisent une session (en ligne ou en présentiel), puis chacun passe un quiz à la fin. Si le quiz est réussi, la progression est envoyée au microservice de profilage.

## 2. Technologies utilisées
- **Langage :** Java
- **Framework :** Spring Boot
- **Base de données :** MySQL
- **Autres outils :** Maven, Swagger (springdoc), Eureka, API Gateway

## 3. Structure du projet
```text
skillexchange/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── controller/
│   │   │   ├── service/
│   │   │   ├── repository/
│   │   │   ├── entity/
│   │   │   └── enums/
│   │   └── resources/
│   │       └── application.properties
│   └── test/
├── pom.xml
├── .env.example
└── README.md
```

## 4. Installation et lancement
### Prérequis
- Java 17
- Maven
- MySQL
- Eureka et API Gateway démarrés

### Installation
```bash
git clone <url-du-depot>
cd skillexchange
mvn clean install
```
Créer la base de données :
```sql
CREATE DATABASE skillexchange_db;
```

### Lancer le service
```bash
mvn spring-boot:run
```
Le service tourne sur `http://localhost:8086`.

## 5. Configuration
| Variable | Description |
|---|---|
| `SERVER_PORT` | Port du service (8086) |
| `DB_URL` | Adresse de la base MySQL |
| `DB_USERNAME` | Utilisateur MySQL |
| `DB_PASSWORD` | Mot de passe MySQL |
| `EUREKA_URL` | Adresse du serveur Eureka |

Exemple dans `.env.example` :
```text
SERVER_PORT=8086
DB_URL=jdbc:mysql://localhost:3306/skillexchange_db
DB_USERNAME=root
DB_PASSWORD=changeme
EUREKA_URL=http://localhost:8761/eureka
```
Ne pas publier les vrais mots de passe.

## 6. Endpoints de l'API
Swagger : `http://localhost:8086/swagger-ui/index.html`

| Méthode | Endpoint | Description |
|---|---|---|
| POST | /api/skills/demandes | Créer une demande |
| GET | /api/skills/demandes | Lister les demandes |
| GET | /api/skills/demandes/{id} | Voir une demande |
| PUT | /api/skills/demandes/{id} | Modifier une demande |
| DELETE | /api/skills/demandes/{id} | Supprimer une demande |
| POST | /api/skills/appariements | Créer un appariement |
| GET | /api/skills/appariements | Lister les appariements |
| PATCH | /api/skills/appariements/{id}/confirmer | Confirmer un appariement |
| PATCH | /api/skills/appariements/{id}/refuser | Refuser un appariement |
| POST | /api/skills/sessions | Planifier une session |
| GET | /api/skills/sessions/{id} | Voir une session |
| PATCH | /api/skills/sessions/{id}/terminer | Terminer la session et créer les quiz |
| PATCH | /api/skills/sessions/{id}/annuler | Annuler la session |
| GET | /api/skills/quiz/{id} | Voir un quiz et ses questions |
| POST | /api/skills/quiz/{id}/soumettre | Envoyer les réponses et calculer le score |

## 7. Base de données
- **Type de base :** MySQL
- **Nom de la base :** `skillexchange_db`
- **Entités principales :** `DemandeCompetence`, `Appariement`, `SessionEchange`, `Quiz`, `QuestionQuiz`

Relations :
- 2 demandes forment 1 appariement
- 1 appariement planifie plusieurs sessions
- 1 session génère 2 quiz (un par étudiant)
- 1 quiz contient plusieurs questions

## 8. Responsabilités de l'équipe
- **Développeur(s) :** *(à compléter)*
- **Responsabilités principales :** *(à compléter)*

## 9. Tests
```bash
mvn test
```
On peut aussi tester les endpoints avec Swagger ou Postman.

## 10. Notes
- Les routes passent par l'API Gateway avec le préfixe `/api/skills/**`.
- À la fin d'une session, un quiz est créé pour chaque étudiant.
- Si le score est supérieur ou égal au score minimum, le quiz est validé et la progression est envoyée au microservice de profilage.
