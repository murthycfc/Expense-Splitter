package com.example.ExpenseSplit.facade.api;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface GroupFacade {
    GroupResponse createGroup( GroupCreationRequest request);
    List<GroupMemberResponse> addMember(UUID groupId, AddMemberRequest request);
    Page<GroupResponse> getGroups(String name, Pageable pageable);
    GroupDetailsResponse getGroup(UUID groupId);
    List<GroupMemberResponse> getMembers(UUID groupId);
    GroupUpdateResponse updateGroup(UUID groupId, GroupUpdateRequest request);
    DeleteGroupMemberResponse deleteMember(UUID groupId, UUID userId);
    DeleteGroupResponse deleteGroup(UUID groupId);
    Page<UserResponse> getNonMembers(UUID groupId, String email, Pageable pageable);
    BigDecimal getTotalExpenses(UUID groupId);
    List<MemberBalance> getMemberBalances(UUID groupId);
}
