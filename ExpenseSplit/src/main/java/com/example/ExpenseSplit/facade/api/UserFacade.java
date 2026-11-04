package com.example.ExpenseSplit.facade.api;

import com.example.ExpenseSplit.dto.request.UserAddRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.UserResponse;
import com.example.ExpenseSplit.model.User;

import java.util.List;
import java.util.UUID;

public interface UserFacade {
    UserResponse addUser(UserAddRequest request);
    List<UserResponse> getAllUsers();
    BaseResponse deleteUser(String userId);
}
