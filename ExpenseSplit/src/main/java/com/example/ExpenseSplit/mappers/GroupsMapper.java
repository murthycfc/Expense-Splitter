package com.example.ExpenseSplit.mappers;

import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.response.GroupCreationResponse;
import com.example.ExpenseSplit.dto.response.GroupResponse;
import com.example.ExpenseSplit.model.Group;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GroupsMapper {
    //Request DTO -> Entity
    Group toEntity(GroupCreationRequest request);

    //Entity -> Response DTO
    GroupCreationResponse toResponse(Group group);

    List<GroupResponse> toGroupResponses(List<Group> groups);

    @Mapping(source = "createdAt", target = "createdAt")
    GroupResponse toGroupResponse(Group group);

//    default Page<GroupResponse> toGroupResponses(Page<Group> groups){
//        if(groups==null){
//            return Page.empty();
//        }
//        return groups.map(this::toGroupResponse);
//    }

}
