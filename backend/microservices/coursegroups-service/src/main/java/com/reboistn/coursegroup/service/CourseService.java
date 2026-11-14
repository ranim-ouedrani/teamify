package com.reboistn.coursegroup.service;

import com.reboistn.coursegroup.dto.CourseRequest;
import com.reboistn.coursegroup.dto.CourseResponse;
import com.reboistn.coursegroup.entity.Course;
import com.reboistn.coursegroup.exception.DuplicateResourceException;
import com.reboistn.coursegroup.exception.ResourceNotFoundException;
import com.reboistn.coursegroup.repository.CourseRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CourseService {

    private final CourseRepository repository;

    public CourseService(CourseRepository repository) {
        this.repository = repository;
    }

    public CourseResponse create(CourseRequest request) {
        if (repository.existsByCode(request.code())) {
            throw new DuplicateResourceException("Un cours avec le code '" + request.code() + "' existe déjà");
        }
        Course course = new Course();
        apply(course, request);
        return CourseResponse.from(repository.save(course));
    }

    @Transactional(readOnly = true)
    public List<CourseResponse> findAll() {
        return repository.findAll().stream().map(CourseResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public CourseResponse findById(Long id) {
        return CourseResponse.from(getOrThrow(id));
    }

    public CourseResponse update(Long id, CourseRequest request) {
        Course course = getOrThrow(id);
        if (repository.existsByCodeAndIdNot(request.code(), id)) {
            throw new DuplicateResourceException("Un cours avec le code '" + request.code() + "' existe déjà");
        }
        apply(course, request);
        return CourseResponse.from(repository.save(course));
    }

    public void delete(Long id) {
        repository.delete(getOrThrow(id));
    }

    private Course getOrThrow(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cours introuvable (id=" + id + ")"));
    }

    private void apply(Course course, CourseRequest r) {
        course.setCode(r.code());
        course.setName(r.name());
        course.setDescription(r.description());
        course.setLevel(r.level());
    }
}
