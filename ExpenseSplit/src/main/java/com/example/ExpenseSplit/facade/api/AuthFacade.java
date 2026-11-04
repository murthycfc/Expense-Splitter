package com.example.ExpenseSplit.facade.api;

import com.example.ExpenseSplit.dto.request.RegisterRequest;
import com.example.ExpenseSplit.dto.response.AuthResponse;

public interface AuthFacade {
    AuthResponse register(RegisterRequest request);
}
