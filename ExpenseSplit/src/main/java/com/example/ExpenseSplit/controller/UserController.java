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
    public ResponseEntity<List<UserResponse>> getAllUsers(){
        return ResponseEntity.ok(userFacade.getAllUsers());
    }

    @PostMapping("/addExpense")
    public ResponseEntity<BaseResponse> addExpense(@Valid @RequestBody ExpenseRequest request){
        return ResponseEntity.ok(expenseFacade.addExpense(request));
    }

    @GetMapping("/getAllExpenses")
    public ResponseEntity<List<ExpenseListResponse>> getAllExpenses(){
        return ResponseEntity.ok(expenseFacade.getAllExpenses());
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
        log.info("aDAd");
        return ResponseEntity.ok(userFacade.deleteUser(userId));
    }

    @DeleteMapping("deleteExpense/{expenseId}")
    public ResponseEntity<BaseResponse> deleteExpense(@PathVariable String expenseId){
        return ResponseEntity.ok(expenseFacade.deleteExpense(expenseId));
    }

    @PutMapping("/editExpense/{expenseId}")
    public ResponseEntity<BaseResponse> editExpense(@PathVariable String expenseId, @Valid @RequestBody ExpenseRequest request){
        return ResponseEntity.ok(expenseFacade.editExpense(expenseId, request));
    }

    @GetMapping("/getExpense/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable String expenseId){
        return ResponseEntity.ok(expenseFacade.getExpense(expenseId));
    }

    @PostMapping("/logout")
    public ResponseEntity<BaseResponse> logout(){
        return ResponseEntity.ok(authFacade.logout());
    }
}

