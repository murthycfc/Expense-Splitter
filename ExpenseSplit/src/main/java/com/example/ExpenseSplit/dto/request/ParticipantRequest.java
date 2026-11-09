package com.example.ExpenseSplit.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.UUID;


@Getter
@Setter
public class ParticipantRequest {

    @NotNull(message = "Participant is required")
    private UUID id;

    private BigDecimal percent;
}
