package com.example.ExpenseSplit.dto.response;

import com.example.ExpenseSplit.model.GroupMember;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Setter
@Getter
public class GroupResponse {
    private UUID id;
    private String name;
    private String description;
    private LocalDateTime createdAt;
}
