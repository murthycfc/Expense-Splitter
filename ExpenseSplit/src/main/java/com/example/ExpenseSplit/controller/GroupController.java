package com.example.ExpenseSplit.controller;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.facade.api.ExpenseFacade;
import com.example.ExpenseSplit.facade.api.GroupFacade;
import com.example.ExpenseSplit.model.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/groups")
@RequiredArgsConstructor
public class GroupController {
    private final GroupFacade groupFacade;
    private final ExpenseFacade expenseFacade;

    @PostMapping("/createGroup")
    public ResponseEntity<GroupCreationResponse> createGroup(@Valid @RequestBody GroupCreationRequest request){
        return ResponseEntity.ok(groupFacade.createGroup(request));
    }

    @PostMapping("/{groupId}/addMember")
    public ResponseEntity<BaseResponse> addMember(@PathVariable UUID groupId,
                                                  @Valid @RequestBody AddMemberRequest request){
        return ResponseEntity.ok(groupFacade.addMember(groupId, request));
    }

    @GetMapping("/getGroups")
    public ResponseEntity<List<GroupResponse>> getGroups(){
        return ResponseEntity.ok(groupFacade.getGroups());
    }

    @GetMapping("/{groupId}/getGroup")
    public ResponseEntity<GroupDetailsResponse> getGroup(@PathVariable("groupId") UUID groupId) {
        return ResponseEntity.ok(groupFacade.getGroup(groupId));
    }
    @GetMapping("/{groupId}/getMembers")
    public ResponseEntity<List<GroupMemberResponse>> getMembers(@PathVariable("groupId") UUID groupId){
        return ResponseEntity.ok(groupFacade.getMembers(groupId));
    }

    @PutMapping("/{groupId}/update")
    public ResponseEntity<GroupUpdateResponse> updateGroup(@PathVariable("groupId") UUID groupId, @Valid @RequestBody GroupUpdateRequest request){
        return ResponseEntity.ok(groupFacade.updateGroup(groupId, request));
    }

    @DeleteMapping("{groupId}/delete/{userId}")
    public ResponseEntity<DeleteGroupMemberResponse> deleteMember(@PathVariable("groupId") UUID groupId,@PathVariable("userId") UUID userId){
        return ResponseEntity.ok(groupFacade.deleteMember(groupId, userId));
    }

    @PostMapping("{groupId}/addExpense")
    public ResponseEntity<BaseResponse> addExpense(@PathVariable UUID groupId, @Valid @RequestBody ExpenseRequest request){
        return ResponseEntity.ok(expenseFacade.addExpense(groupId, request));
    }

    @GetMapping("{groupId}/getExpenses")
    public ResponseEntity<Page<ExpenseListResponse>> getExpenses(
            @PathVariable UUID groupId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size){
        Pageable pageable = PageRequest.of(page, size, Sort.by("created_at").descending());
        return ResponseEntity.ok(expenseFacade.getExpenses(groupId, pageable));
    }

    @DeleteMapping("{groupId}/delete")
    public ResponseEntity<DeleteGroupResponse> deleteGroup(@PathVariable UUID groupId){
        return ResponseEntity.ok(groupFacade.deleteGroup(groupId));
    }
}
