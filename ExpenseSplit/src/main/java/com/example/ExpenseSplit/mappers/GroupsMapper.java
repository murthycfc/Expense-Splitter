package com.example.ExpenseSplit.mappers;

import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.response.GroupCreationResponse;
import com.example.ExpenseSplit.dto.response.GroupResponse;
import com.example.ExpenseSplit.model.Group;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GroupsMapper {
    //Request DTO -> Entity
    Group toEntity(GroupCreationRequest request);

    //Entity -> Response DTO
    GroupCreationResponse toResponse(Group group);


    List<GroupResponse> toGroupResponses(List<Group> groups);
}
