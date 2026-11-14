package com.reboistn.coursegroup.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.reboistn.coursegroup.dto.CourseResponse;
import com.reboistn.coursegroup.exception.ResourceNotFoundException;
import com.reboistn.coursegroup.service.CourseService;
import java.time.LocalDateTime;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CourseController.class)
class CourseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CourseService service;

    private CourseResponse sample() {
        LocalDateTime now = LocalDateTime.now();
        return new CourseResponse(1L, "AMS-4", "Architecture microservices", "desc", "4ème année", now, now);
    }

    @Test
    void createReturns201WithLocation() throws Exception {
        when(service.create(any())).thenReturn(sample());

        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"AMS-4\",\"name\":\"Architecture microservices\"}"))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/api/courses/1"))
                .andExpect(jsonPath("$.code").value("AMS-4"));
    }

    @Test
    void createWithBlankNameReturns400() throws Exception {
        mockMvc.perform(post("/api/courses")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"code\":\"AMS-4\",\"name\":\"\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void findAllReturnsList() throws Exception {
        when(service.findAll()).thenReturn(List.of(sample()));

        mockMvc.perform(get("/api/courses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Architecture microservices"));
    }

    @Test
    void findByIdUnknownReturns404() throws Exception {
        when(service.findById(99L)).thenThrow(new ResourceNotFoundException("Cours introuvable (id=99)"));

        mockMvc.perform(get("/api/courses/99")).andExpect(status().isNotFound());
    }

    @Test
    void deleteReturns204() throws Exception {
        mockMvc.perform(delete("/api/courses/1")).andExpect(status().isNoContent());
    }

    @Test
    void deleteUnknownReturns404() throws Exception {
        doThrow(new ResourceNotFoundException("Cours introuvable (id=99)")).when(service).delete(99L);

        mockMvc.perform(delete("/api/courses/99")).andExpect(status().isNotFound());
    }
}
