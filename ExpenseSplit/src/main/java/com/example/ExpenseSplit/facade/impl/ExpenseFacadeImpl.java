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
import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.repo.ExpenseRepository;
import com.example.ExpenseSplit.repo.GroupRepository;
import com.example.ExpenseSplit.service.api.ExpenseService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Component
@Slf4j
public class ExpenseFacadeImpl implements ExpenseFacade {
    private final ExpenseService expenseService;
    private final ExpenseRepository expenseRepository;
    private final GroupRepository groupRepository;

    @Override
    public ExpenseListResponse addExpense(UUID groupId, ExpenseRequest request) {
        try {
            Group group = groupRepository.findByGroupId(groupId.toString())
                    .orElseThrow(()-> new ResourceNotFoundException("Group not found"));
            return expenseService.addExpense(group, request);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }

    }

    @Override
    public Page<ExpenseListResponse> getExpenses(UUID groupId, Pageable pageable) {
        try {
            Group group = groupRepository.findByGroupId(groupId.toString())
                    .orElseThrow(()-> new ResourceNotFoundException("Group not found"));
            return expenseService.getExpenses(group, pageable);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
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
    public BaseResponse deleteExpense(UUID expenseId) {
        try {
            Expense expense = expenseRepository.findExpenseById(expenseId.toString()).orElseThrow(()->new ResourceNotFoundException("Expense not found to delete"));
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
    public BaseResponse editExpense(UUID expenseId, ExpenseRequest request) {
        try {
            Expense expense = expenseRepository.findExpenseById(expenseId.toString())
                    .orElseThrow(()->new ResourceNotFoundException("Expense not found"));
            return expenseService.editExpense(expense, request);
        } catch (ResourceNotFoundException e) {
            log.error("An error occurred in editExpense {}", e.getMessage());
            throw new ResourceNotFoundException(e.getMessage());
        }
    }

    @Override
    public ExpenseResponse getExpense(UUID expenseId) {
        try {
            Expense expense = expenseRepository.findExpenseById(expenseId.toString())
                    .orElseThrow(()-> new ResourceNotFoundException("Expense not found to edit"));
            return expenseService.getExpense( expense);
        } catch (ResourceNotFoundException e) {
            log.error("An error occurred in getExpense {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("An unexpected error occurred in getExpense {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }
}
