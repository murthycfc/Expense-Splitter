package com.example.ExpenseSplit.mappers;

import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.model.GroupMember;
import com.example.ExpenseSplit.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface GroupMemberMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "group", source = "group")
    @Mapping(target = "user", source = "user")
    GroupMember toEntity(Group group, User user);
}
