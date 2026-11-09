package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.enums.Status;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class ExpenseResponse {
    private UUID id;
    private UUID groupId;
    private String description;
    private BigDecimal amount;
    private UUID paidBy;
    private String payerName;
    private LocalDate date;
    private Status status;
    private List<ParticipantResponse> participants = new ArrayList<>();
}
