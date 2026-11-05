package com.example.ExpenseSplit.service.impl;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceNotFoundException;
import com.example.ExpenseSplit.mappers.GroupMemberMapper;
import com.example.ExpenseSplit.mappers.GroupsMapper;
import com.example.ExpenseSplit.mappers.UserMapper;
import com.example.ExpenseSplit.model.Group;
import com.example.ExpenseSplit.model.GroupMember;
import com.example.ExpenseSplit.model.User;
import com.example.ExpenseSplit.repo.GroupMemberRepository;
import com.example.ExpenseSplit.repo.GroupRepository;
import com.example.ExpenseSplit.repo.UserRepository;
import com.example.ExpenseSplit.security.SecurityUtils;
import com.example.ExpenseSplit.service.api.GroupService;
import jakarta.transaction.Transactional;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import
import java.util.*;

@Setter
@Getter
@Service
@Slf4j
@RequiredArgsConstructor
public class GroupServiceImpl implements GroupService {

    private final GroupsMapper groupsMapper;
    private final GroupMemberMapper groupMemberMapper;
    private final GroupRepository groupRepository;
    private final UserRepository userRepository;
    private final GroupMemberRepository groupMemberRepository;
    private final UserMapper userMapper;

    @Override
    @Transactional
    public GroupCreationResponse createGroup(GroupCreationRequest request) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();

            // creating group
            Group group = groupsMapper.toEntity(request);
            group.setCreatedBy(currentUser);

            //creating group member
            GroupMember groupMember = groupMemberMapper.toEntity(group, currentUser);

            //adding group member to group
            group.getGroupMembers().add(groupMember);

            Group savedGroup = groupRepository.save(group);

            return groupsMapper.toResponse(savedGroup);
        } catch (Exception e) {
            log.error("An unexpected error occurred in createGroup {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponse addMember(Group group, AddMemberRequest request) {
        try {
            List<UUID> userIds = request.getUserIds();
            Set<UUID> uniqueUserIds = new HashSet<>(userIds);

            if(userIds.size()!=uniqueUserIds.size()){
                throw new BadRequestException("Duplicate users are not allowed");
            }

            List<User> users = new ArrayList<>();
            for(UUID userId : userIds) {
                User user = userRepository.findByUserId(userId.toString())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found to add as member"));

                Integer exists = groupMemberRepository.alreadyExists(group.getId().toString(), userId.toString());
                if(exists==1){
                    log.error("A user with id {} already present in the group", userId);
                    throw new BadRequestException("A user already present in the group");
                }
                users.add(user);
            }

            List<GroupMember> newMembers = new ArrayList<>();
            for(User user : users){
                //creating group member
                GroupMember groupMember = groupMemberMapper.toEntity(group, user);
                newMembers.add(groupMember);
            }
            group.getGroupMembers().addAll(newMembers);
            groupMemberRepository.saveAll(newMembers);
            log.info("New members added successfully");

            BaseResponse response = new BaseResponse();
            response.setMessage("Users added successfully");
            return response;

        }
        catch (ResourceNotFoundException | BadRequestException e){
            log.error("An error occurred in addMember {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in addMember {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }

    @Override
    public List<GroupResponse> getGroups() {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            List<Group> groups = groupRepository.getGroups(currentUser.getId().toString());

            return groupsMapper.toGroupResponses(groups);
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<GroupMemberResponse> getMembers(Group group) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            Integer memberOfGroup = groupMemberRepository.isUserMemberOfGroup(group.getId().toString(), currentUser.getId().toString());
            if(memberOfGroup==0){
                throw new BadRequestException("You don't have access to fetch this group members");
            }
            List<GroupMember> groupMembers = groupMemberRepository.findMembersByGroupId(group.getId().toString());
            List<User> users = new ArrayList<>();
            for(GroupMember groupMember : groupMembers){
                User user = userRepository.findByUserId(groupMember.getUser().getId().toString())
                        .orElseThrow(()-> new ResourceNotFoundException("A user not found in group"));
                users.add(user);
            }

            return userMapper.toGroupMemberResponse(users);
        }
        catch (ResourceNotFoundException | BadRequestException e){
            log.error("An error occurred in getMembers {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in getMembers {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public GroupUpdateResponse updateGroup(Group group, GroupUpdateRequest request) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            Integer memberOfGroup = groupMemberRepository.isUserMemberOfGroup(group.getId().toString(), currentUser.getId().toString());
            if(memberOfGroup==0){
                throw new BadRequestException("You don't have access to update this group");
            }
            group.setName(request.getName());
            group.setDescription(request.getDescription());
            groupRepository.save(group);
            log.info("Group updated successfully");

            GroupUpdateResponse response = new GroupUpdateResponse();
            response.setName(request.getName());
            response.setDescription(request.getDescription());
            return response;
        }

        catch (BadRequestException e){
            log.error("An error occurred in updateGroup {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in updateGroup {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public DeleteGroupMemberResponse deleteMember(Group group, User user){
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            if(group.getCreatedBy()!=currentUser){
                throw new ResourceNotFoundException("You don't have access to delete users");
            }
            Integer memberOfGroup = groupMemberRepository.isUserMemberOfGroup(group.getId().toString(), user.getId().toString());
            if(memberOfGroup==0){
                throw new BadRequestException("This user not a member of this group");
            }

            GroupMember groupMember = groupMemberRepository.getMemberByGroupAndUser(group.getId().toString(), user.getId().toString());
            groupMember.setDeleted(true);
            groupMemberRepository.save(groupMember);

            DeleteGroupMemberResponse response = new DeleteGroupMemberResponse();
            response.setUserId(user.getId());
            response.setMessage("User removed from Group");
            return response;
        }
        catch (ResourceNotFoundException | BadRequestException e){
            log.error("An error occurred in deleteMember {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in deleteMember {}", e.getMessage());
            throw new RuntimeException(e);
        }

    }

}
