package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.enums.MemberBalanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class BalanceSummaryItem {
    private String userName;
    private BigDecimal amount;
    private MemberBalanceStatus status;
}
