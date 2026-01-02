package app.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import app.dto.MessageRequest;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

//TEST API CONTROLLER GET & POST
@RestController
@RequestMapping("/api")
public class ApiController {
    private String message = "Hello from Spring Boot!";

    //GET MAPPING
    @GetMapping("/demo")
    public String hello() {
        return "\"message\": \"" + message + "\"";
    }

    //POST MAPPING
    @PostMapping("/demo")
    public String postMessage(@RequestBody MessageRequest request) {
        this.message = request.getMessage();
        return message;
    }
}
