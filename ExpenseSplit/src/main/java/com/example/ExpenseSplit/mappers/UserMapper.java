package com.example.ExpenseSplit.mappers;

import com.example.ExpenseSplit.dto.response.GroupMemberResponse;
import com.example.ExpenseSplit.dto.response.UserResponse;
import com.example.ExpenseSplit.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    GroupMemberResponse toGroupMemberResponse(User user);
    List<GroupMemberResponse> toGroupMemberResponse(List<User> users);

    UserResponse toUserResponse(User user);
}
