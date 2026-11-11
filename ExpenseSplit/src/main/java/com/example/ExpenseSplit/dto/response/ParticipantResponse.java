package com.example.ExpenseSplit.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ParticipantResponse {
    private String userId;
    private String name;
    private BigDecimal percent;
    private BigDecimal value;
}
