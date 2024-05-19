package com.beebook.beebookproject.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ProfileController {

    @GetMapping("/auth")
    @ResponseBody
    public Authentication authentication(Authentication authentication) {
        //Lấy tất cả thông tin từ token
        return authentication;
    }


    @GetMapping("/auth/id")
    public String getUserId(Authentication authentication) {
        //Lấy id user từ token người dùng

        String userId = null;
        if (authentication != null && authentication.getPrincipal() != null) {
            if (authentication.getPrincipal() instanceof org.springframework.security.oauth2.jwt.Jwt) {
                userId = SecurityContextHolder.getContext().getAuthentication().getName();
            }
        }
        return userId;
    }
}
