package com.example.ExpenseSplit.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class AddMemberRequest {
    @NotEmpty(message = "At least one user is required")
    private List<UUID> userIds;
}
