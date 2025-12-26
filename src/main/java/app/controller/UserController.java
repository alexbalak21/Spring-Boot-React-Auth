package app.controller;

import app.dto.UpdatePasswordRequest;
import app.dto.UpdateUserRequest;
import app.dto.UserInfo;
import app.dto.UserInfoProfileImage;
import app.model.User;
import app.security.CustomUserDetails;
import app.service.UserService;
import io.jsonwebtoken.io.IOException;
import app.service.UserProfileImageService;
import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final UserProfileImageService userProfileImageService;

    public UserController(UserService userService,
            UserProfileImageService userProfileImageService) {
        this.userService = userService;
        this.userProfileImageService = userProfileImageService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<UserInfoProfileImage> currentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(403).build();
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails user) {
            // Fetch Base64 image from service
            String base64Image = userProfileImageService.getBase64Image(user.getId());

            // Wrap into DTO
            UserInfoProfileImage userInfo_ProfileImage = new UserInfoProfileImage(new UserInfo(user), base64Image);

            return ResponseEntity.ok(userInfo_ProfileImage);
        }

        return ResponseEntity.status(500).build();
    }

    // Update profile (name, email, etc.)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/profile")
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

    // Partial update profile (PATCH)
    @PreAuthorize("isAuthenticated()")
    @PatchMapping("/profile")
    public ResponseEntity<UserInfo> patchProfile(@RequestBody UpdateUserRequest updateRequest) {
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

    // Update password (requires current password check)
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/password")
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

    //Updates the User profileImage 
    @PreAuthorize("isAuthenticated()")
    @PostMapping("/profile-image")
    public ResponseEntity<?> uploadProfileImage(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty() || !file.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Only image files are allowed");
            }

            CustomUserDetails currentUser = userService.getCurrentUser();

            // Save the new image
            String savedImageBase64 = userProfileImageService.saveCompressedImage(currentUser.getUser(), file);

            // Build full DTO (same as GET /api/user)
            UserInfoProfileImage dto = new UserInfoProfileImage(new UserInfo(currentUser.getUser()), savedImageBase64);

            return ResponseEntity.ok(dto);

        } catch (IOException e) {
            return ResponseEntity.badRequest().body("Invalid image file");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload profile image");
        }
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/profile-image")
    public ResponseEntity<?> deleteProfileImage() {
        try {
            CustomUserDetails currentUser = userService.getCurrentUser();

            userProfileImageService.deleteProfileImage(currentUser.getId());

            return ResponseEntity.ok("Profile image deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to delete profile image");
        }
    }

}
