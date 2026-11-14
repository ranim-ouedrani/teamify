package com.reboistn.coursegroup.controller;

import com.reboistn.coursegroup.dto.CourseRequest;
import com.reboistn.coursegroup.dto.CourseResponse;
import com.reboistn.coursegroup.dto.ErrorResponse;
import com.reboistn.coursegroup.service.CourseService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
@Tag(name = "Courses", description = "Gestion des cours / modules")
public class CourseController {

    private final CourseService service;

    public CourseController(CourseService service) {
        this.service = service;
    }

    @Operation(summary = "Créer un cours")
    @ApiResponse(responseCode = "201", description = "Cours créé")
    @ApiResponse(responseCode = "400", description = "Données invalides",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Code déjà utilisé",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PostMapping
    public ResponseEntity<CourseResponse> create(@Valid @RequestBody CourseRequest request) {
        CourseResponse created = service.create(request);
        return ResponseEntity.created(URI.create("/api/courses/" + created.id())).body(created);
    }

    @Operation(summary = "Lister les cours")
    @GetMapping
    public List<CourseResponse> findAll() {
        return service.findAll();
    }

    @Operation(summary = "Consulter un cours")
    @ApiResponse(responseCode = "200", description = "Cours trouvé")
    @ApiResponse(responseCode = "404", description = "Cours introuvable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @GetMapping("/{id}")
    public CourseResponse findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @Operation(summary = "Modifier un cours")
    @ApiResponse(responseCode = "200", description = "Cours modifié")
    @ApiResponse(responseCode = "400", description = "Données invalides",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "404", description = "Cours introuvable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @ApiResponse(responseCode = "409", description = "Code déjà utilisé",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @PutMapping("/{id}")
    public CourseResponse update(@PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return service.update(id, request);
    }

    @Operation(summary = "Supprimer un cours")
    @ApiResponse(responseCode = "204", description = "Cours supprimé")
    @ApiResponse(responseCode = "404", description = "Cours introuvable",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class)))
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
