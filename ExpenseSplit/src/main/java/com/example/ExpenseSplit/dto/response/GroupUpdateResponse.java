package com.example.ExpenseSplit.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Getter
@Setter
public class GroupUpdateResponse {
    private UUID id;
    private String name;
    private String description;
}
