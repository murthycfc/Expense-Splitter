package com.example.ExpenseSplit.facade.impl;

import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.response.BaseResponse;
import com.example.ExpenseSplit.dto.response.ExpenseListResponse;
import com.example.ExpenseSplit.dto.response.ExpenseResponse;
import com.example.ExpenseSplit.dto.response.MemberBalance;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceNotFoundException;
import com.example.ExpenseSplit.facade.api.ExpenseFacade;
import com.example.ExpenseSplit.model.Expense;
import com.example.ExpenseSplit.repo.ExpenseRepository;
import com.example.ExpenseSplit.service.api.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@RequiredArgsConstructor
@Component
@Slf4j
public class ExpenseFacadeImpl implements ExpenseFacade {
    private final ExpenseService expenseService;
    private final ExpenseRepository expenseRepository;

    @Override
    public BaseResponse addExpense(ExpenseRequest request) {
        return expenseService.addExpense(request);
    }

    @Override
    public List<ExpenseListResponse> getAllExpenses() {
        return expenseService.getAllExpenses();
    }

    @Override
    public List<MemberBalance> getMemberBalances() {
        return expenseService.getMemberBalances();
    }

    @Override
    public BigDecimal getTotalExpenses() {
        return expenseService.getTotalExpenses();
    }

    @Override
    public BaseResponse deleteExpense(String expenseId) {
        try {
            Expense expense = expenseRepository.findExpenseById(expenseId).orElseThrow(()->new ResourceNotFoundException("Expense not found to delete"));
            return expenseService.deleteExpense(expense);
        }
        catch (ResourceNotFoundException e){
            log.error("Expense not found to delete");
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in deleteExpense method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponse editExpense(String expenseId, ExpenseRequest request) {
        try {
            Expense expense = expenseRepository.findExpenseById(expenseId)
                    .orElseThrow(()->new ResourceNotFoundException("Expense not found"));
            return expenseService.editExpense(expense, request);
        } catch (ResourceNotFoundException e) {
            log.error("An error occurred in editExpense {}", e.getMessage());
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    @Override
    public ExpenseResponse getExpense(String expenseId) {
        try {
            Expense expense = expenseRepository.findExpenseById(expenseId)
                    .orElseThrow(()-> new ResourceNotFoundException("Expense not found to edit"));
            return expenseService.getExpense(expense);
        } catch (ResourceNotFoundException e) {
            log.error("An error occurred in getExpense {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("An unexpected error occurred in getExpense {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
}
