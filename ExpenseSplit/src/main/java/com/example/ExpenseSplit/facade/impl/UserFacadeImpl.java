package com.example.ExpenseSplit.facade.impl;

import com.example.ExpenseSplit.dto.request.UserAddRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.UserResponse;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceNotFoundException;
import com.example.ExpenseSplit.facade.api.UserFacade;
import com.example.ExpenseSplit.model.User;
import com.example.ExpenseSplit.repo.UserRepository;
import com.example.ExpenseSplit.service.api.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@Slf4j
@RequiredArgsConstructor
public class UserFacadeImpl implements UserFacade {
    private final UserService userService;
    private final UserRepository userRepository;
    @Override
    public UserResponse addUser(UserAddRequest request) {
        return userService.addUser(request);
    }

    @Override
    public List<UserResponse> getAllUsers(String email) {
        return userService.getAllUsers(email);
    }

    @Override
    public BaseResponse deleteUser(String userId) {
        try {
            User user = userRepository.findByUserId(userId).orElseThrow(()->
                    new ResourceNotFoundException("User not found to delete"));
            return userService.deleteUser(user);
        } catch (Exception e) {
            log.info("User not found");
            throw new BadRequestException(e.getMessage());
        }
    }


}
