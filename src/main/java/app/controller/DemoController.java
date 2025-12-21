package app.controller;

import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/test")
public class DemoController {


    @GetMapping
    public String home(){
        return "{\"message\":\"Hello from Protected endpoint \"}";
    }

    @PostMapping
    public Map<String, String> post(@RequestBody Map<String, String> request){
        String message = request.get("message");
        return Map.of("message", message);

    }
}
