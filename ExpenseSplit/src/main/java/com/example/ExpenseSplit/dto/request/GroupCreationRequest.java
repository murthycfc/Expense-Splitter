package com.example.ExpenseSplit.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GroupCreationRequest {
    @NotBlank(message = "Group name is required")
    private String name;
    private String description;
}
