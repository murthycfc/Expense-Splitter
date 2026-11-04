package com.example.ExpenseSplit.controller;

import com.example.ExpenseSplit.dto.request.RegisterRequest;
import com.example.ExpenseSplit.dto.response.AuthResponse;
import com.example.ExpenseSplit.facade.api.AuthFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/auth")
@RestController
@Slf4j
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthFacade authFacade;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request){
        return ResponseEntity.ok(authFacade.register(request));
    }


}
