package app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.dto.MessageRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api")
public class ApiController {
    private String message = "Hello from Spring Boot!";

    @GetMapping("/demo")
    public String hello() {
        return "\"message\": \"" + message + "\"";
    }

    @PostMapping("/demo")
    public String postMessage(@RequestBody MessageRequest request) {
        this.message = request.getMessage();
        return message;
    }
}
