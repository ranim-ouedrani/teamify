package com.reboistn.gamification.service;

import com.reboistn.gamification.dto.HelloResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HelloService {

    private final String serviceName;

    public HelloService(@Value("${spring.application.name}") String serviceName) {
        this.serviceName = serviceName;
    }

    public HelloResponse buildHelloResponse() {
        return new HelloResponse(serviceName, "UP", "Hello from ReboisTN!");
    }
}
