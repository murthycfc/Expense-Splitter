package com.example.ExpenseSplit.service.api;

import com.example.ExpenseSplit.dto.request.RegisterRequest;
import com.example.ExpenseSplit.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
}