package com.example.ExpenseSplit.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;


@Getter
@Setter
public class ParticipantRequest {

    @NotBlank(message = "Participant is required")
    private String id;

    private BigDecimal percent;
}
