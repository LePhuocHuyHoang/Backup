package com.beebook.beebookproject.service;

import com.beebook.beebookproject.dto.UserRegistrationRecord;
import org.springframework.http.ResponseEntity;

public interface KeycloakUserService {

    ResponseEntity<?> createUser(UserRegistrationRecord userRegistrationRecord);
    ResponseEntity<?> deleteUserById(String userId);
    void emailVerification(String userId);
    ResponseEntity<?> forgotPassword(String username);
}
