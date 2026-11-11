package com.example.ExpenseSplit.service.api;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.ExpenseListResponse;
import com.example.ExpenseSplit.dto.response.ExpenseResponse;
import com.example.ExpenseSplit.dto.response.MemberBalance;
import com.example.ExpenseSplit.model.Expense;
import com.example.ExpenseSplit.model.Group;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;


public interface ExpenseService {
    ExpenseListResponse addExpense(Group group, ExpenseRequest request);
    Page<ExpenseListResponse> getExpenses(Group group, Pageable pageable);
    List<MemberBalance> getMemberBalances();
    BigDecimal getTotalExpenses();
    BaseResponse deleteExpense(Expense expense);
    ExpenseResponse editExpense( Expense expense, ExpenseRequest request);
    ExpenseResponse getExpense(Expense expense);

}
