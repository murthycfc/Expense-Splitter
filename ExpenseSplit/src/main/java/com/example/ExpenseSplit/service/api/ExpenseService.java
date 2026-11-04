package com.example.ExpenseSplit.service.api;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.ExpenseListResponse;
import com.example.ExpenseSplit.dto.response.ExpenseResponse;
import com.example.ExpenseSplit.dto.response.MemberBalance;
import com.example.ExpenseSplit.model.Expense;

import java.math.BigDecimal;
import java.util.List;


public interface ExpenseService {
    BaseResponse addExpense(ExpenseRequest request);
    List<ExpenseListResponse> getAllExpenses();
    List<MemberBalance> getMemberBalances();
    BigDecimal getTotalExpenses();
    BaseResponse deleteExpense(Expense expense);
    BaseResponse editExpense(Expense expense, ExpenseRequest request);
    ExpenseResponse getExpense(Expense expense);
}
