package com.reboistn.coursegroup.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(LocalDateTime timestamp, int status, String error, List<String> details) {

    public static ErrorResponse of(int status, String error, List<String> details) {
        return new ErrorResponse(LocalDateTime.now(), status, error, details);
    }
}
