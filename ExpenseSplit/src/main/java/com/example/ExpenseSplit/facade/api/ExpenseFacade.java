package com.example.ExpenseSplit.facade.api;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.ExpenseListResponse;
import com.example.ExpenseSplit.dto.response.ExpenseResponse;
import com.example.ExpenseSplit.dto.response.MemberBalance;
import com.example.ExpenseSplit.model.Expense;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public interface ExpenseFacade {
    BaseResponse addExpense(ExpenseRequest request);
    List<ExpenseListResponse> getAllExpenses();
    List<MemberBalance> getMemberBalances();
    BigDecimal getTotalExpenses();
    BaseResponse deleteExpense(String expenseId);
    BaseResponse editExpense(String expenseId, ExpenseRequest request);
    ExpenseResponse getExpense(String expenseId);
}
