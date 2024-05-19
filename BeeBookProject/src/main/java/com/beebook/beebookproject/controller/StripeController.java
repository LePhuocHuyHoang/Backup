package com.beebook.beebookproject.controller;

import com.beebook.beebookproject.common.util.Helpers;
import com.beebook.beebookproject.dto.*;
import com.beebook.beebookproject.exception.ResponseEntityErrorException;
import com.beebook.beebookproject.payloads.ApiResponse;
import com.beebook.beebookproject.service.StripeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stripe")
public class StripeController {

    private final StripeService stripeService;


    public StripeController(StripeService stripeService) {
        this.stripeService = stripeService;
    }

    @ExceptionHandler(ResponseEntityErrorException.class)
    public ResponseEntity<ApiResponse> handleExceptions(ResponseEntityErrorException exception) {
        return exception.getApiResponse();
    }

    @PostMapping("/card/token")
    @ResponseBody
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> createCardToken(@RequestBody StripeTokenDto model) {
        return stripeService.createCardToken(model);
    }

    @PostMapping("/charge")
    @ResponseBody
    public ResponseEntity<?> charge(@RequestBody StripeChargeDto model) {
        return stripeService.charge(model);
    }

    @PostMapping("/buy")
    @ResponseBody
    @PreAuthorize("hasAuthority('USER')")
    public ResponseEntity<?> buy(@RequestParam(name = "bookId") Long bookId) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Jwt jwtToken = ((JwtAuthenticationToken) authentication).getToken();
        String jwt = jwtToken.getTokenValue();
        String username = Helpers.getUserByJWT(jwt);
        System.out.println(jwt);
        return stripeService.buy(bookId, username);
    }
}

