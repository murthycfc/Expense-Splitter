package com.example.ExpenseSplit.facade.api;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.ExpenseListResponse;
import com.example.ExpenseSplit.dto.response.ExpenseResponse;
import com.example.ExpenseSplit.dto.response.MemberBalance;
import com.example.ExpenseSplit.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Component
public interface ExpenseFacade {
    ExpenseListResponse addExpense(UUID groupId, ExpenseRequest request);
    Page<ExpenseListResponse> getExpenses(UUID groupId, Pageable pageable);
    List<MemberBalance> getMemberBalances();
    BigDecimal getTotalExpenses();
    BaseResponse deleteExpense(UUID expenseId);
    ExpenseResponse editExpense( UUID expenseId, ExpenseRequest request);
    ExpenseResponse getExpense(UUID expenseId);
}
