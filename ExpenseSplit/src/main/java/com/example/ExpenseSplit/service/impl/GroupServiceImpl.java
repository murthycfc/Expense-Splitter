package com.example.ExpenseSplit.service.impl;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.exception.AccessDeniedException;
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
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
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
    @Transactional
    public List<GroupMemberResponse> addMember(Group group, AddMemberRequest request) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            log.info("current user {}", currentUser.getEmail());

            GroupMember member = groupMemberRepository.findByGroupAndUser(group.getId().toString(), currentUser.getId().toString())
                    .orElseThrow(()-> new BadRequestException("You are not member of this group. So can't add"));
            log.info("member {}", member.getUser().getEmail());
            if(member.isDeleted()){
                throw new BadRequestException("You no longer member of this group. So can't add");
            }
            List<UUID> userIds = request.getUserIds();
            Set<UUID> uniqueUserIds = new HashSet<>(userIds);

            if(userIds.size()!=uniqueUserIds.size()){
                throw new BadRequestException("Duplicate users are not allowed");
            }

            List<GroupMember> newMembers = new ArrayList<>();
            List<GroupMember> membersToSave = new ArrayList<>();

            for(UUID userId : userIds) {
                User user = userRepository.findByUserId(userId.toString())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found to add as member"));
                Optional<GroupMember> existingGroupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), userId.toString());
                if(existingGroupMember.isPresent()){

                    GroupMember groupMember = existingGroupMember.get();

                    if(!groupMember.isDeleted()){
                        throw new BadRequestException("User already member of this group");
                    }

                    groupMember.setDeleted(false);
                    membersToSave.add(groupMember);
                }
                else{
                    //new member
                    GroupMember groupMember = groupMemberMapper.toEntity(group, user);
                    newMembers.add(groupMember);
                    membersToSave.add(groupMember);
                }
            }

            group.getGroupMembers().addAll(newMembers);
            List<GroupMember> savedMembers = groupMemberRepository.saveAll(membersToSave);
            log.info("Members added successfully");

            List<User> users = new ArrayList<>();
            for(GroupMember groupMember : savedMembers){
                users.add(groupMember.getUser());
            }
            return userMapper.toGroupMemberResponse(users);

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
    public GroupDetailsResponse getGroup(Group group) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            Integer memberOfGroup = groupMemberRepository.isMemberOfGroup(group.getId().toString(), currentUser.getId().toString());
            if(memberOfGroup==0){
                throw new BadRequestException("You don't have access to fetch this group details");
            }

            GroupDetailsResponse response = new GroupDetailsResponse();
            BeanUtils.copyProperties(group, response);

            List<GroupMember> groupMembers = groupMemberRepository.findMembersByGroupId(group.getId().toString());
            List<User> users = new ArrayList<>();

            for(GroupMember groupMember : groupMembers){
                User user = userRepository.findByUserId(groupMember.getUser().getId().toString())
                        .orElseThrow(()-> new ResourceNotFoundException("A user not found in group"));
                users.add(user);
            }
            response.setMembers(userMapper.toGroupMemberResponse(users));
            return  response;
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<GroupMemberResponse> getMembers(Group group) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            Integer memberOfGroup = groupMemberRepository.isMemberOfGroup(group.getId().toString(), currentUser.getId().toString());
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
            Integer memberOfGroup = groupMemberRepository.isMemberOfGroup(group.getId().toString(), currentUser.getId().toString());
            if(memberOfGroup==0){
                throw new BadRequestException("You don't have access to update this group");
            }
            group.setName(request.getName());
            group.setDescription(request.getDescription());
            groupRepository.save(group);
            log.info("Group updated successfully");

            GroupUpdateResponse response = new GroupUpdateResponse();
            BeanUtils.copyProperties(group, response);
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
            if(!group.getCreatedBy().getId().equals(currentUser.getId())){
                throw new AccessDeniedException("You don't have access to delete users");
            }

            GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), user.getId().toString())
                    .orElseThrow(()->new ResourceNotFoundException("Member not found in the group"));
            if(groupMember.isDeleted()){
                throw new BadRequestException("Member already removed from the group");
            }

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

    @Override
    public DeleteGroupResponse deleteGroup(Group group) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            if(!group.getCreatedBy().getId().equals(currentUser.getId())){
                throw new AccessDeniedException("You don't have access to delete group");
            }
            group.setDeleted(true);
            groupRepository.save(group);

            DeleteGroupResponse response = new DeleteGroupResponse();
            response.setGroupId(group.getId());
            response.setMessage("Group deleted successfully");
            return response;

        }
        catch (AccessDeniedException e){
            log.error("An error occurred in deleteGroup {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in deleteGroup {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<UserResponse> getNonMembers(Group group) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            Integer memberOfGroup = groupMemberRepository.isMemberOfGroup(group.getId().toString(), currentUser.getId().toString());
            if(memberOfGroup==0){
                throw new BadRequestException("You don't have access to fetch non this group");
            }
            List<User> users = userRepository.getAllUsers();
            List<User> nonMembers = new ArrayList<>();
            for(User user : users){
                if(groupMemberRepository.isMemberOfGroup(group.getId().toString(), user.getId().toString())==1){
                    continue;
                }
                else{
                    nonMembers.add(user);
                }
            }
            return userMapper.toUserResponse(nonMembers);
        }
        catch (Exception e) {
            log.info("An error occurred");
            throw new BadRequestException(e.getMessage());
        }
    }

}
