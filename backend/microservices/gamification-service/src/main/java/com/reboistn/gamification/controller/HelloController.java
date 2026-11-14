package com.reboistn.gamification.controller;

import com.reboistn.gamification.dto.HelloResponse;
import com.reboistn.gamification.service.HelloService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    private final HelloService helloService;

    public HelloController(HelloService helloService) {
        this.helloService = helloService;
    }

    @GetMapping(value = "/hello", produces = MediaType.APPLICATION_JSON_VALUE)
    public HelloResponse hello() {
        return helloService.buildHelloResponse();
    }
}
