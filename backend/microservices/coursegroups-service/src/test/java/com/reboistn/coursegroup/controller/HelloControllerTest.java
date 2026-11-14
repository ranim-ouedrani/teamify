package com.reboistn.coursegroup.controller;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.reboistn.coursegroup.dto.DatabaseStatusResponse;
import com.reboistn.coursegroup.dto.HelloResponse;
import com.reboistn.coursegroup.service.DatabaseStatusService;
import com.reboistn.coursegroup.service.HelloService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(HelloController.class)
class HelloControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private HelloService helloService;

    @MockBean
    private DatabaseStatusService databaseStatusService;

    @Test
    void helloReturns200AndJson() throws Exception {
        when(helloService.hello()).thenReturn(
                new HelloResponse("course-group-service", "UP", "Hello from Course / Group Service!"));

        mockMvc.perform(get("/hello"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.service").value("course-group-service"))
                .andExpect(jsonPath("$.status").value("UP"))
                .andExpect(jsonPath("$.message").value("Hello from Course / Group Service!"));
    }

    @Test
    void helloDbReturns503WhenDatabaseDown() throws Exception {
        when(databaseStatusService.check()).thenReturn(new DatabaseStatusResponse("MySQL", "DOWN", "refused"));

        mockMvc.perform(get("/hello/db")).andExpect(status().isServiceUnavailable());
    }
}
