package com.example.ExpenseSplit.controller;

import com.example.ExpenseSplit.dto.request.AddMemberRequest;
import com.example.ExpenseSplit.dto.request.GroupCreationRequest;
import com.example.ExpenseSplit.dto.request.GroupUpdateRequest;
import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.facade.api.GroupFacade;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {
    private final GroupFacade groupFacade;

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

    @GetMapping("/{groupId}/getMembers")
    public ResponseEntity<List<GroupMemberResponse>> getMembers(@PathVariable("groupId") UUID groupId){
        return ResponseEntity.ok(groupFacade.getMembers(groupId));
    }

    @PutMapping("/{groupId}/update")
    public ResponseEntity<GroupUpdateResponse> updateGroup(@PathVariable("groupId") UUID groupId, @Valid @RequestBody GroupUpdateRequest request){
        return ResponseEntity.ok(groupFacade.updateGroup(groupId, request));
    }
}
