package com.reboistn.coursegroup.dto;

import com.reboistn.coursegroup.entity.Course;
import java.time.LocalDateTime;

public record CourseResponse(
        Long id,
        String code,
        String name,
        String description,
        String level,
        LocalDateTime createdAt,
        LocalDateTime updatedAt) {

    public static CourseResponse from(Course c) {
        return new CourseResponse(c.getId(), c.getCode(), c.getName(), c.getDescription(),
                c.getLevel(), c.getCreatedAt(), c.getUpdatedAt());
    }
}
