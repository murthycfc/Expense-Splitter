package com.example.ExpenseSplit.mappers;

import com.example.ExpenseSplit.dto.response.GroupMemberResponse;
import com.example.ExpenseSplit.model.User;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {
    List<GroupMemberResponse> toGroupMemberResponse(List<User> users);
}
