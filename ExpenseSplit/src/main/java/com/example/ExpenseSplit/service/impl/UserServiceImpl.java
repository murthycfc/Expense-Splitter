package com.example.ExpenseSplit.service.impl;

import com.example.ExpenseSplit.dto.request.UserAddRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.UserResponse;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.model.User;
import com.example.ExpenseSplit.repo.UserRepository;
import com.example.ExpenseSplit.service.api.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;

    @Override
    public UserResponse addUser(UserAddRequest request) {
        try {
            if(userRepository.existsEmail(request.getEmail())==1){
                throw new BadRequestException("email already exists");
            }

            User user = new User();
            BeanUtils.copyProperties(request, user);
            User savedUser = userRepository.save(user);
            log.info("User created with email {}", savedUser.getEmail());
            UserResponse response = new UserResponse();
            BeanUtils.copyProperties(savedUser, response);
            return response;
        } catch (Exception e) {
            log.error("An unexpected error occurred in addUser method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<UserResponse> getAllUsers(String email) {
        try {
            List<User> users;
            if(email==null || email.isBlank()){
                users = userRepository.getAllUsers();
            }
            else {
                users = userRepository.searchUsersByEmail(email.trim());
            }
            List<UserResponse> activeUsers = new ArrayList<>();

            for(User user : users){
                UserResponse response = new UserResponse();
                BeanUtils.copyProperties(user, response);

                activeUsers.add(response);
            }
            return activeUsers;
        } catch (Exception e) {
            log.error("An unexpected error occurred in getAllUsers method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponse deleteUser(User user) {
        try {
            user.setDeleted(true);
            userRepository.save(user);
            log.info("User Deleted with email {}", user.getEmail());
            BaseResponse response = new BaseResponse();
            response.setMessage("User deleted successfully");
            return response;
        } catch (Exception e) {
            log.error("An unexpected error occurred in deleteUser method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
}
