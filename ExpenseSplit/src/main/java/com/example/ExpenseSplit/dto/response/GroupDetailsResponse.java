package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.model.Expense;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
public class GroupDetailsResponse {
    private UUID id;
    private String name;
    private String description;
    private List<GroupMemberResponse> members;
}
