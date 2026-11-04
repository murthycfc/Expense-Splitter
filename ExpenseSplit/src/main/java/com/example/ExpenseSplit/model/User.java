package com.example.ExpenseSplit.model;

import com.example.ExpenseSplit.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User extends BaseEntity{

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(nullable = false, name = "phone_number", unique = true)
    private String phoneNumber;

    @Column(name = "logged_in", nullable = false)
    private boolean loggedIn = false;

    @Column(name="last_logout_time")
    private LocalDateTime lastLogout;

}
