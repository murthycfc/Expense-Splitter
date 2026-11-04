package com.example.ExpenseSplit.service.api;

import com.example.ExpenseSplit.dto.request.LoginRequest;
import com.example.ExpenseSplit.dto.request.RegisterRequest;
import com.example.ExpenseSplit.dto.response.AuthResponse;
import com.example.ExpenseSplit.dto.response.BaseResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    BaseResponse logout();
}