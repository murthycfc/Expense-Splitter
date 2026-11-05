//package com.example.ExpenseSplit.facade.impl;
//
//import com.example.ExpenseSplit.dto.response.GroupMemberResponse;
//import com.example.ExpenseSplit.exception.ResourceNotFoundException;
//import com.example.ExpenseSplit.facade.api.GroupMemberFacade;
//import com.example.ExpenseSplit.model.Group;
//import com.example.ExpenseSplit.repo.GroupRepository;
//import com.example.ExpenseSplit.service.api.GroupMemberService;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.stereotype.Component;
//
//import java.util.List;
//import java.util.UUID;
//
//@Component
//@RequiredArgsConstructor
//@Slf4j
//public class GroupMemberFacadeImpl implements GroupMemberFacade {
//    private final GroupRepository groupRepository;
//    private final GroupMemberService groupMemberService;
//    @Override
//    public List<GroupMemberResponse> getMembers(UUID groupId) {
//        try {
//            Group group = groupRepository.findByGroupId(groupId.toString())
//                    .orElseThrow(()-> new ResourceNotFoundException("Group not found"));
//            return groupMemberService.getMembers(group);
//        }
//        catch (ResourceNotFoundException e){
//            log.error("An error occurred in getMembers {}", e.getMessage());
//            throw e;
//        }
//        catch (Exception e) {
//            log.error("An unexpected error occurred in getMembers {}", e.getMessage());
//            throw new RuntimeException(e);
//        }
//    }
//}
