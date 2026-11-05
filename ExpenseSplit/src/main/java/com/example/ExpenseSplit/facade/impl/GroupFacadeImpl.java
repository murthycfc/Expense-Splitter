package com.example.ExpenseSplit.facade.impl;


import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceNotFoundException;
import com.example.ExpenseSplit.facade.api.GroupFacade;
import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.repo.GroupRepository;
import com.example.ExpenseSplit.service.api.GroupService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class GroupFacadeImpl implements GroupFacade {

    private final GroupRepository groupRepository;
    private final GroupService groupService;

    @Override
    public GroupCreationResponse createGroup(GroupCreationRequest request) {
        return groupService.createGroup(request);
    }

    @Override
    public BaseResponse addMember(UUID groupId, AddMemberRequest request) {
        try {
            Group group = groupRepository.findByGroupId(groupId.toString())
                    .orElseThrow(()-> new ResourceNotFoundException("Group not found to add members"));
            return groupService.addMember(group, request);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<GroupResponse> getGroups() {
        return groupService.getGroups();
    }

    public List<GroupMemberResponse> getMembers(UUID groupId) {
        try {
            Group group = groupRepository.findByGroupId(groupId.toString())
                    .orElseThrow(()-> new ResourceNotFoundException("Group not found"));
            return groupService.getMembers(group);
        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in getMembers {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in getMembers {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public GroupUpdateResponse updateGroup(UUID groupId, GroupUpdateRequest request) {
        try {
            Group group = groupRepository.findByGroupId(groupId.toString())
                    .orElseThrow(()-> new ResourceNotFoundException("Group not found"));
            return groupService.updateGroup(group, request);
        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in updateGroup {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in updateGroup {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
