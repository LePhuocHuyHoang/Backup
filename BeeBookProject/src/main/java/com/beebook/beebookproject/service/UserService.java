package com.beebook.beebookproject.service;

import com.beebook.beebookproject.entities.User;
import com.beebook.beebookproject.payloads.ApiResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;


public interface UserService {
    ResponseEntity<ApiResponse> deleteComment(Long commentId);
    ResponseEntity<ApiResponse> deleteUserByUserName(String userName);
    ResponseEntity<?> getUser(Long id);
    ResponseEntity<?> getRentedBook(String userName, Long month, Long year, Long offset, Long fetch);
    public User findByUserName(String userName);
    List<Map<String, Object>> getBookmark(String username, Long offset, Long fetch);
    ResponseEntity<?> getProfile(String userName);
}
