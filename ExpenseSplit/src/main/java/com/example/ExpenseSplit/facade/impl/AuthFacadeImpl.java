package com.example.ExpenseSplit.facade.impl;

import com.example.ExpenseSplit.dto.request.RegisterRequest;
import com.example.ExpenseSplit.dto.response.AuthResponse;
import com.example.ExpenseSplit.facade.api.AuthFacade;
import com.example.ExpenseSplit.service.api.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class AuthFacadeImpl implements AuthFacade {
    private final AuthService authService;
    @Override
    public AuthResponse register(RegisterRequest request) {
        return authService.register(request);
    }
}
