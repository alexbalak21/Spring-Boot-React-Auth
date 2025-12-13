package app.service;

import app.dto.UpdateUserRequest;
import app.model.User;

public interface UserService {
    User updateUser(Long userId, UpdateUserRequest updateRequest);
    User getCurrentUser();
}
