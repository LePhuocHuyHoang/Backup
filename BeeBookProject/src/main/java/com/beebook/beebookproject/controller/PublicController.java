package com.beebook.beebookproject.controller;

import com.beebook.beebookproject.service.KeycloakUserService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
@AllArgsConstructor
public class PublicController {

    private final KeycloakUserService keycloakUserService;


    @GetMapping("/hello")
    public String hello(){
        return "Hello";
    }

    @PutMapping("/{username}/forgot-password")
    public ResponseEntity<?> forgotPassword(@PathVariable String username) {
        //check trùng csdl

        return keycloakUserService.forgotPassword(username);

    }
}
