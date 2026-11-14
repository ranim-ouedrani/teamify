package com.reboistn.coursegroup.service;

import com.reboistn.coursegroup.dto.HelloResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class HelloService {

    private final String serviceName;

    public HelloService(@Value("${spring.application.name}") String serviceName) {
        this.serviceName = serviceName;
    }

    public HelloResponse hello() {
        return new HelloResponse(serviceName, "UP", "Hello from Course / Group Service!");
    }
}
