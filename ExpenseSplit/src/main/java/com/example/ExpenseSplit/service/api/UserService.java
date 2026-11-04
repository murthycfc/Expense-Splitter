package com.example.ExpenseSplit.service.api;

import com.example.ExpenseSplit.dto.request.UserAddRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.UserResponse;
import com.example.ExpenseSplit.model.User;

import java.util.List;
import java.util.UUID;

public interface UserService {
    UserResponse addUser(UserAddRequest request);
    List<UserResponse> getAllUsers();
    BaseResponse deleteUser(User user);
}

