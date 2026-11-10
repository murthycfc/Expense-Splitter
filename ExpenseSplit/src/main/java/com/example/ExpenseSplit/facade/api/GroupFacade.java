package com.example.ExpenseSplit.facade.api;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.model.User;

import java.util.List;
import java.util.UUID;

public interface GroupFacade {
    GroupCreationResponse createGroup( GroupCreationRequest request);
    List<GroupMemberResponse> addMember(UUID groupId, AddMemberRequest request);
    List<GroupResponse> getGroups();
    GroupDetailsResponse getGroup(UUID groupId);
    List<GroupMemberResponse> getMembers(UUID groupId);
    GroupUpdateResponse updateGroup(UUID groupId, GroupUpdateRequest request);
    DeleteGroupMemberResponse deleteMember(UUID groupId, UUID userId);
    DeleteGroupResponse deleteGroup(UUID groupId);
    List<UserResponse> getNonMembers(UUID groupId);
}
