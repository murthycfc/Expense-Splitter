package com.example.ExpenseSplit.controller;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.ExpenseListResponse;
import com.example.ExpenseSplit.dto.response.ExpenseResponse;
import com.example.ExpenseSplit.facade.api.ExpenseFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@Slf4j
public class ExpenseController {

    private final ExpenseFacade expenseFacade;

    @GetMapping("/getExpense/{expenseId}")
    public ResponseEntity<ExpenseResponse> getExpense(@PathVariable UUID expenseId){
        return ResponseEntity.ok(expenseFacade.getExpense(expenseId));
    }

    @PutMapping("/editExpense/{expenseId}")
    public ResponseEntity<ExpenseResponse> editExpense( @PathVariable UUID expenseId, @Valid @RequestBody ExpenseRequest request){
        return ResponseEntity.ok(expenseFacade.editExpense( expenseId, request));
    }

    @DeleteMapping("deleteExpense/{expenseId}")
    public ResponseEntity<BaseResponse> deleteExpense(@PathVariable UUID expenseId){
        return ResponseEntity.ok(expenseFacade.deleteExpense(expenseId));
    }


}
