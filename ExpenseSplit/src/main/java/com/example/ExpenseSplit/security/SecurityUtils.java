package com.example.ExpenseSplit.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Optional;
import java.util.UUID;

public class SecurityUtils {
    public static CustomUserPrincipal getCurrentPrincipal(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (CustomUserPrincipal) authentication.getPrincipal();
    }

    public static UUID getCurrentUserId(){
        return getCurrentPrincipal().getUserId();
    }
    public static Optional<? extends GrantedAuthority> getRole(){
        return getCurrentPrincipal().getAuthorities().stream().findFirst();
    }
}
