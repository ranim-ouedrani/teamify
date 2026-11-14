package com.reboistn.coursegroup.controller;

import com.reboistn.coursegroup.dto.DatabaseStatusResponse;
import com.reboistn.coursegroup.dto.HelloResponse;
import com.reboistn.coursegroup.service.DatabaseStatusService;
import com.reboistn.coursegroup.service.HelloService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    private final HelloService helloService;
    private final DatabaseStatusService databaseStatusService;

    public HelloController(HelloService helloService, DatabaseStatusService databaseStatusService) {
        this.helloService = helloService;
        this.databaseStatusService = databaseStatusService;
    }

    @GetMapping("/hello")
    public HelloResponse hello() {
        return helloService.hello();
    }

    @GetMapping("/hello/db")
    public ResponseEntity<DatabaseStatusResponse> database() {
        DatabaseStatusResponse status = databaseStatusService.check();
        HttpStatus http = "UP".equals(status.status()) ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE;
        return ResponseEntity.status(http).body(status);
    }
}
