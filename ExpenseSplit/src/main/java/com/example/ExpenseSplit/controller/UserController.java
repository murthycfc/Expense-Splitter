package com.example.ExpenseSplit.controller;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.request.UserAddRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.facade.api.AuthFacade;
import com.example.ExpenseSplit.facade.api.ExpenseFacade;
import com.example.ExpenseSplit.facade.api.UserFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {
    private final UserFacade userFacade;
    private final ExpenseFacade expenseFacade;
    private final AuthFacade authFacade;

    @PostMapping("/addUser")
    public ResponseEntity<UserResponse> addUser(@Valid @RequestBody UserAddRequest request){
        return ResponseEntity.ok(userFacade.addUser(request));
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<List<UserResponse>> getAllUsers(
            @RequestParam(required = false) String email){
        return ResponseEntity.ok(userFacade.getAllUsers(email));
    }

    @GetMapping("/getMemberBalances")
    public ResponseEntity<List<MemberBalance>> getMemberBalances(){
        return ResponseEntity.ok(expenseFacade.getMemberBalances());
    }

    @GetMapping("/getTotoalExpenses")
    public ResponseEntity<BigDecimal> getTotalExpenses(){
        return ResponseEntity.ok(expenseFacade.getTotalExpenses());
    }

    @DeleteMapping("/deleteUser/{userId}")
    public ResponseEntity<BaseResponse> deleteUser(@PathVariable String userId){
        return ResponseEntity.ok(userFacade.deleteUser(userId));
    }



    @PostMapping("/logout")
    public ResponseEntity<BaseResponse> logout(){
        return ResponseEntity.ok(authFacade.logout());
    }
}

