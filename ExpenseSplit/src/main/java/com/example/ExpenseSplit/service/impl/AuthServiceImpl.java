package com.example.ExpenseSplit.service.impl;

import com.example.ExpenseSplit.dto.request.RegisterRequest;
import com.example.ExpenseSplit.dto.response.AuthResponse;
import com.example.ExpenseSplit.enums.Role;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceAlreadyExistsException;
import com.example.ExpenseSplit.model.User;
import com.example.ExpenseSplit.repo.UserRepository;
import com.example.ExpenseSplit.security.CustomUserPrincipal;
import com.example.ExpenseSplit.security.JwtService;
import com.example.ExpenseSplit.service.api.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class AuthServiceImpl implements AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Override
    public AuthResponse register(RegisterRequest request) {
        try {
            if(userRepository.existsEmail(request.getEmail())==1){
                throw new BadRequestException("Email already exists");
            }
            User user = new User();
            BeanUtils.copyProperties(request, user);
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setRole(Role.USER);
            user.setLoggedIn(true);
            User savedUser = userRepository.save(user);

            log.info("New user registered with email {}", request.getEmail());

            AuthResponse response = new AuthResponse();
            BeanUtils.copyProperties(savedUser,response);
            CustomUserPrincipal principal = new CustomUserPrincipal(savedUser);
            String token = jwtService.generateToken(principal);
            response.setToken(token);

            return response;
        }
        catch (BadRequestException ex){
            log.error("An error occurred in register {}", ex.getMessage());
            throw ex;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in register {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
}
