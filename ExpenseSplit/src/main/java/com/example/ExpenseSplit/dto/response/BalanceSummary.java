package com.example.ExpenseSplit.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class BalanceSummary {
    private String name;
    private String email;
    private BigDecimal netBalance;
    List<BalanceSummaryItem> balanceSummaryItems;
}
