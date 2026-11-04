package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.enums.MemberBalanceStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class MemberBalance {
    private String name;
    private BigDecimal totalPaid;
    private BigDecimal totalShare;
    private BigDecimal netBalance;
    private MemberBalanceStatus status;
}
