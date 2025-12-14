package app.service;

import app.dto.UpdatePasswordRequest;
import app.dto.UpdateUserRequest;
import app.model.User;
import app.security.CustomUserDetails;

public interface UserService {
    User updateUser(Long userId, UpdateUserRequest updateRequest);
    CustomUserDetails getCurrentUser();
    void updatePassword(Long userId, UpdatePasswordRequest passwordRequest);
}
