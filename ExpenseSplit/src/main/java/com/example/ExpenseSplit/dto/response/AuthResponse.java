package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.enums.Role;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class AuthResponse {
    private UUID id;
    private String name;
    private String email;
    private Role role;
    private String token;
}
