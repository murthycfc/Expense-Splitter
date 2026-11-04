package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.enums.Status;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ExpenseListResponse {
    private UUID id;
    private String description;
    private BigDecimal amount;
    private String paidBy;
    private LocalDate date;
    private Status status;
    private List<String> participants;


}
