package app.controller;

import app.dto.UpdatePasswordRequest;
import app.dto.UpdateUserRequest;
import app.dto.UserInfo;
import app.model.User;
import app.security.CustomUserDetails;
import app.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ Get current authenticated user
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/user")
    public ResponseEntity<UserInfo> currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails user) {
            return ResponseEntity.ok(new UserInfo(user));
        }

        return ResponseEntity.status(500).body(null);
    }

    // ✅ Update profile (name, email, etc.)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/user/profile")
    public ResponseEntity<UserInfo> updateProfile(@Valid @RequestBody UpdateUserRequest updateRequest) {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();
            User updatedUser = userService.updateUser(currentUser.getId(), updateRequest);
            return ResponseEntity.ok(new UserInfo(updatedUser));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(null);
        }
    }

    // ✅ Update password (requires current password check)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/user/password")
    public ResponseEntity<?> updatePassword(@Valid @RequestBody UpdatePasswordRequest passwordRequest) {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();
            userService.updatePassword(currentUser.getId(), passwordRequest);
            return ResponseEntity.ok("Password updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("An error occurred while updating password");
        }
    }
}
