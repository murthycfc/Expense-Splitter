package com.example.ExpenseSplit.service.api;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.model.User;

import java.util.List;
import java.util.UUID;

public interface GroupService {
    GroupCreationResponse createGroup(GroupCreationRequest request);
    BaseResponse addMember(Group group, AddMemberRequest request);
    List<GroupResponse> getGroups();
    List<GroupMemberResponse> getMembers(Group group);
    GroupUpdateResponse updateGroup(Group group, GroupUpdateRequest request);
    DeleteGroupMemberResponse deleteMember(Group group, User user);
}
