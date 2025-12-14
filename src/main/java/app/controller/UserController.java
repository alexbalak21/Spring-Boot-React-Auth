package app.controller;

import app.dto.UpdatePasswordRequest;
import app.dto.UpdateUserRequest;
import app.dto.UserInfo;
import app.model.User;
import app.security.CustomUserDetails;
import app.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class UserController {
    
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public ResponseEntity<UserInfo> currentUser(Authentication authentication) {
        System.out.println("Fetching current user information...");
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        // Print the whole Authentication object
        System.out.println("Authentication: " + authentication);

        // Print the principal specifically
        Object principal = authentication.getPrincipal();
        System.out.println("Principal class: " + principal.getClass().getName());
        System.out.println("Principal: " + principal);

        // If you expect CustomUserDetails
        if (principal instanceof CustomUserDetails user) {
            System.out.println("User ID: " + user.getId());
            System.out.println("User Email: " + user.getEmail());
            System.out.println("User Name: " + user.getUsername());
            System.out.println("User Role: " + user.getAuthorities());
            return ResponseEntity.ok(new UserInfo(user));
        }

        return ResponseEntity.status(500).build();
    }

    @PutMapping("/user/profile")
    public ResponseEntity<UserInfo> updateProfile(@Valid @RequestBody UpdateUserRequest updateRequest) {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();
            User updatedUser = userService.updateUser(currentUser.getId(), updateRequest);
            return ResponseEntity.ok(new UserInfo(updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/user/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest passwordRequest) {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();
            userService.updatePassword(currentUser.getId(), passwordRequest);
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating password");
        }
    }  
}
