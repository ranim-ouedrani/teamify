
# Course / Group Service

Spring Boot microservice responsible for managing **courses, modules, projects and student groups** in the Teamify collaborative learning platform.

This microservice (MS3) exposes a REST API to manage courses, including creation, consultation, modification and deletion. It also provides Swagger/OpenAPI documentation for API testing and integration.

## Technologies

- Java
- Spring Boot
- Spring Data JPA
- REST API
- Swagger / OpenAPI 3.0
- H2 Database

## Run

```bash
mvn spring-boot:run
```

**Service URL:** http://localhost:8085

- Swagger UI: [http://localhost:8085/swagger-ui/index.html](http://localhost:8085/swagger-ui/index.html)
- OpenAPI JSON: [http://localhost:8085/v3/api-docs](http://localhost:8085/v3/api-docs)

## Endpoints

### Courses

Management of courses and academic modules.

| Method | Path | Description |
|---|---|---|
| GET | `/api/courses` | List all courses |
| GET | `/api/courses/{id}` | Retrieve a course by ID |
| POST | `/api/courses` | Create a new course |
| PUT | `/api/courses/{id}` | Update an existing course |
| DELETE | `/api/courses/{id}` | Delete a course |

### Hello Controller

A simple endpoint used to verify that the microservice is running.

## API Schemas

The API uses the following schemas:

| Schema | Description |
|---|---|
| `CourseRequest` | Data required to create or update a course |
| `CourseResponse` | Course information returned by the API |
| `ErrorResponse` | Error response structure |
| `HelloResponse` | Response of the Hello endpoint |
| `DatabaseStatusResponse` | Database connection status |

## Project Structure

```text
com.teamify.course
├── config          Configuration classes
├── controller      REST API controllers
├── dto             Request and Response DTOs
├── entity          JPA entities
├── repository      Spring Data JPA repositories
├── service         Business logic
└── exception       Exception handling
```

## Microservice Responsibilities

The Course / Group Service (MS3) is responsible for:

- Managing courses and academic modules.
- Managing classes and projects.
- Handling group creation requests.
- Managing validated student groups.
- Allowing teachers to manually modify group assignments.
- Maintaining group assignment history and versions.

## Integration

This microservice is part of the **Teamify** microservices architecture.

It communicates with other microservices through REST APIs and the API Gateway.

The service is designed to integrate with the student profiling, machine learning and analytics services to support automatic and balanced student group formation.

## API Documentation

Swagger UI provides an interactive interface to explore, test and document all available REST endpoints.

**Open Swagger:** http://localhost:8085/swagger-ui/index.html
