package tn.esprit.skillexchange.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@Tag(name = "Skills", description = "Skill exchange endpoints")
public class SkillController {

    @Operation(summary = "Get all skills")
    @GetMapping
    public List<String> getAll() {
        return List.of("Java", "Angular", "Docker");
    }

    @Operation(summary = "Add a skill")
    @PostMapping
    public String add(@RequestBody String skill) {
        return "Added: " + skill;
    }
}