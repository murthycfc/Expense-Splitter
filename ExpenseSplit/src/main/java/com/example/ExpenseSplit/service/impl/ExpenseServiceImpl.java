package com.example.ExpenseSplit.service.impl;

import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.enums.Status;
import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.request.ParticipantRequest;
import com.example.ExpenseSplit.enums.MemberBalanceStatus;
import com.example.ExpenseSplit.exception.AccessDeniedException;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceNotFoundException;
import com.example.ExpenseSplit.model.*;
import com.example.ExpenseSplit.repo.*;
import com.example.ExpenseSplit.security.SecurityUtils;
import com.example.ExpenseSplit.service.api.ExpenseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class ExpenseServiceImpl implements ExpenseService {
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;
    private final ParticipantRepository participantRepository;
    private final GroupMemberRepository groupMemberRepository;
    @Override
    @Transactional
    public ExpenseListResponse addExpense(Group group, ExpenseRequest request) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();

            GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), currentUser.getId().toString())
                    .orElseThrow(()-> new AccessDeniedException("You are not member in this group. So can't create expense"));

            if(groupMember.isDeleted()){
                throw new AccessDeniedException("You are no longer member in this group. So can't create expense");
            }

            User paidByUser = userRepository.findByUserId(request.getPaidBy().toString()).orElseThrow(()->
                    new ResourceNotFoundException("User not found to add Paid by"));

            GroupMember payerMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), paidByUser.getId().toString())
                    .orElseThrow(()-> new BadRequestException("Payer is not member in this group"));
            if(payerMember.isDeleted()){
                throw new BadRequestException("Payer no longer member in this group");
            }
            if(request.getDate().isAfter(LocalDate.now())){
                throw new BadRequestException("Can't create expense for future dates");
            }

            if(request.getParticipants()==null || request.getParticipants().isEmpty()){
                throw new BadRequestException("At least one participant is required");
            }
            if(request.getParticipants().size()==1 && paidByUser.getId().equals(request.getParticipants().get(0).getId())){
                throw new BadRequestException("The payer cannot be the only participant in an expense");
            }

            Set<UUID> uniqueParticipants = new HashSet<>();
            for(ParticipantRequest participantRequest : request.getParticipants()){
                if(!uniqueParticipants.add(participantRequest.getId())){
                    throw new BadRequestException("Duplicate participants found");
                }
            }

            Status status = request.getStatus();
            BigDecimal totalPercent = BigDecimal.ZERO;

            if(status == Status.PERCENTAGE){
                for(ParticipantRequest participantRequest : request.getParticipants()){
                    BigDecimal percent = participantRequest.getPercent();
                    if(percent==null){
                        throw new BadRequestException("Percentage is required for every participant");
                    }
                    if(percent.compareTo(BigDecimal.ZERO)<=0){
                        throw new BadRequestException("Percentage must be greater than 0");
                    }
                    if(percent.compareTo(BigDecimal.valueOf(100))>0){
                        throw new BadRequestException("Percentage must be less than or equal to 100");
                    }
                    totalPercent=totalPercent.add(participantRequest.getPercent());
                }

                log.info("total percent {}", totalPercent);
                if(totalPercent.compareTo(BigDecimal.valueOf(100))!=0){
                    throw new BadRequestException("Individual percents not equal to 100");
                }
            }

            Map<UUID, User> participantUsers = new HashMap<>();
            for(ParticipantRequest participantRequest : request.getParticipants()){
                User participant = userRepository.findByUserId(participantRequest.getId().toString()).orElseThrow(()->
                        new ResourceNotFoundException("User not found to add participant"));
                GroupMember groupParticipant = groupMemberRepository.findByGroupAndUser(group.getId().toString(), participant.getId().toString())
                        .orElseThrow(()-> new BadRequestException("Participant not found in this group"));
                if(groupParticipant.isDeleted()){
                    throw new BadRequestException("Participant no longer member in this group");
                }
                participantUsers.put(participant.getId(), participant);
            }

            Expense expense = new Expense();
            BeanUtils.copyProperties(request, expense);
            expense.setPaidBy(paidByUser);
            expense.setCreatedBy(currentUser);
            expense.setGroup(group);

            BigDecimal amount = request.getAmount();
            int participantSize = request.getParticipants().size();
            List<Participant> participants = new ArrayList<>();

            for(ParticipantRequest participantRequest : request.getParticipants()){
                User participantUser = participantUsers.get(participantRequest.getId());
                Participant participant = new Participant();
                participant.setExpense(expense);
                participant.setUser(participantUser);
                participant.setPercent(participantRequest.getPercent());
                if(status==Status.PERCENTAGE){

                    BigDecimal share = amount.multiply(participantRequest.getPercent().divide(new BigDecimal("100"), 2, RoundingMode.HALF_UP));
                    participant.setValue(share);
                }
                else {
                    BigDecimal splitAmount = amount.divide(BigDecimal.valueOf(participantSize),2, RoundingMode.HALF_UP);
                    participant.setValue(splitAmount);
                }
                participants.add(participant);
            }
            expense.setParticipants(participants);
            Expense savedExpense = expenseRepository.save(expense);
            log.info("Expense created successfully");

            ExpenseListResponse response = new ExpenseListResponse();
            BeanUtils.copyProperties(savedExpense, response);
            response.setGroupId(savedExpense.getGroup().getId());
            response.setPaidBy(savedExpense.getPaidBy().getName());
            List<String> savedParticipants = new ArrayList<>();
            for(Participant participant : savedExpense.getParticipants()){
                savedParticipants.add(participant.getUser().getName());
            }
            response.setParticipants(savedParticipants);
            return response;
        }
        catch (ResourceNotFoundException | AccessDeniedException  e){
            log.error("An error occurred in AddExpense {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in AddExpense method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public Page<ExpenseListResponse> getExpenses(Group group, Pageable pageable) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), currentUser.getId().toString())
                    .orElseThrow(()-> new AccessDeniedException("You are not member in this group"));
            if(groupMember.isDeleted()){
                throw new AccessDeniedException("You no longer member in this group");
            }

            Page<Expense> expenses = expenseRepository.findExpensesByGroup(group.getId().toString(), pageable);

            Page<ExpenseListResponse> responses = expenses.map(expense -> {
                ExpenseListResponse response = new ExpenseListResponse();
                BeanUtils.copyProperties(expense, response);
                response.setPaidBy(expense.getPaidBy().getName());
                response.setGroupId(expense.getGroup().getId());

                List<String> participantNames = new ArrayList<>();
                for(Participant participant : expense.getParticipants()){
                    if(!participant.isDeleted()){
                        participantNames.add(participant.getUser().getName());
                    }
                }
                response.setParticipants(participantNames);
                return response;
            });
            return responses;
        }
        catch (AccessDeniedException e){
            log.error("An error occurred in getExpenses {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in getExpenses {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public ExpenseResponse getExpense(Expense expense) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();
            Group group = expense.getGroup();

            GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), currentUser.getId().toString())
                    .orElseThrow(()-> new AccessDeniedException("You are not member in this group. So can't fetch expense"));

            if(groupMember.isDeleted()){
                throw new AccessDeniedException("You are no longer member in this group. So can't fetch expense");
            }

            ExpenseResponse response = new ExpenseResponse();
            BeanUtils.copyProperties(expense, response);
            response.setPaidBy(expense.getPaidBy().getId());
            response.setGroupId(expense.getGroup().getId());
            response.setPayerName(expense.getPaidBy().getName());
            List <Participant> participants = participantRepository.getActiveExpenseParticipants(expense.getId().toString());
            log.info("participants size {}", participants.size());
            List<ParticipantResponse> participantResponses= new ArrayList<>();

            for(Participant participant : participants){
                ParticipantResponse participantResponse = new ParticipantResponse();
                participantResponse.setUserId(participant.getUser().getId().toString());
                participantResponse.setName(participant.getUser().getName());
                participantResponse.setPercent(participant.getPercent());
                participantResponses.add(participantResponse);
            }
            response.setParticipants(participantResponses);
            log.info("participants response {}", participantResponses);
            return  response;
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BigDecimal getTotalExpenses() {
        try {
            List<Expense> expenses = expenseRepository.findAllExpenses();
            BigDecimal totalExpenses = BigDecimal.ZERO;
            for(Expense expense : expenses){
                totalExpenses = totalExpenses.add(expense.getAmount());
            }
            return totalExpenses;
        } catch (Exception e) {
            log.error("An unexpected error occurred in getTotalExpenses method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }

    }

    @Override
    @Transactional
    public BaseResponse editExpense( Expense expense, ExpenseRequest request) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();

            Group group = expense.getGroup();

            GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), currentUser.getId().toString())
                    .orElseThrow(()-> new AccessDeniedException("You are not member in this group. So can't edit expense"));

            if(groupMember.isDeleted()){
                throw new AccessDeniedException("You are no longer member in this group. So can't edit expense");
            }

            User paidByUser = userRepository.findByUserId(request.getPaidBy().toString()).orElseThrow(()->
                    new ResourceNotFoundException("User not found to add Paid by"));

            GroupMember payerMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), paidByUser.getId().toString())
                    .orElseThrow(()-> new BadRequestException("Payer is not member in this group"));
            if(payerMember.isDeleted()){
                throw new BadRequestException("Payer no longer member in this group");
            }

            if(request.getDate().isAfter(LocalDate.now())){
                throw new BadRequestException("Can't update expense to future dates");
            }
            if(request.getParticipants()==null || request.getParticipants().isEmpty()){
                throw new BadRequestException("At least one participant is required");
            }
            if(request.getParticipants().size()==1 && paidByUser.getId().equals(request.getParticipants().get(0).getId())){
                throw new BadRequestException("The payer cannot be the only participant in an expense");
            }

            List<ParticipantRequest> participantRequests = request.getParticipants();
            Set<UUID> requestedUserIds = new HashSet<>();
            for(ParticipantRequest participantRequest : participantRequests){
                if(!requestedUserIds.add(participantRequest.getId())){
                    throw new BadRequestException("Duplicate participants found");
                }
            }

            Status status = request.getStatus();
            BigDecimal totalPercent = BigDecimal.ZERO;
            if(status == Status.PERCENTAGE){
                for(ParticipantRequest participantRequest : participantRequests){
                    BigDecimal percent = participantRequest.getPercent();
                    if(percent==null){
                        throw new BadRequestException("Percentage is required for every participant");
                    }
                    if(percent.compareTo(BigDecimal.ZERO)<=0){
                        throw new BadRequestException("Percentage must be greater than 0");
                    }
                    if(percent.compareTo(BigDecimal.valueOf(100))>0){
                        throw new BadRequestException("Percentage must be less than or equal to 100");
                    }
                    totalPercent  = totalPercent.add(participantRequest.getPercent());
                }

                if(totalPercent.compareTo(BigDecimal.valueOf(100))!=0){
                    throw new BadRequestException("Individual percents not equal to 100");
                }
            }

            Map<UUID, User> participantUsers = new HashMap<>();
            for(ParticipantRequest participantRequest : request.getParticipants()){

                User participant = userRepository.findByUserId(participantRequest.getId().toString()).orElseThrow(()->
                        new ResourceNotFoundException("User not found to add participant"));
                GroupMember groupParticipant = groupMemberRepository.findByGroupAndUser(group.getId().toString(), participant.getId().toString())
                        .orElseThrow(()-> new BadRequestException("Participant not found in this group"));
                if(groupParticipant.isDeleted()){
                    throw new BadRequestException("Participant no longer member in this group");
                }
                participantUsers.put(participant.getId(), participant);
            }


            BeanUtils.copyProperties(request, expense);
            expense.setPaidBy(paidByUser);

            List<Participant> expenseParticipants = participantRepository.getExpenseParticipants(expense.getId().toString());
            log.info("Number of existing participants: {}", expenseParticipants.size());
            for(Participant participant : expenseParticipants){
                UUID existingUserId = participant.getUser().getId();
                if(!requestedUserIds.contains(existingUserId)){
                    participant.setDeleted(true);
                }
            }

            BigDecimal amount = request.getAmount();
            int participantSize = participantRequests.size();
            BigDecimal equalsAmount = amount.divide(BigDecimal.valueOf(participantSize), 2, RoundingMode.HALF_UP);

            for(ParticipantRequest participantRequest : participantRequests){
                User participantUser = participantUsers.get(participantRequest.getId());
                Participant existingParticipant  = expenseParticipants.stream().filter(p->p.getUser().getId().equals(participantUser.getId()))
                        .findFirst().orElse(null);

                if(existingParticipant!=null){
                    existingParticipant.setDeleted(false);
                    if(status==Status.EQUAL){
                        existingParticipant.setValue(equalsAmount);
                        existingParticipant.setPercent(null);
                    }
                    else{
                        existingParticipant.setPercent(participantRequest.getPercent());
                        existingParticipant.setValue(amount.multiply(participantRequest.getPercent().divide(new BigDecimal("100"),2,RoundingMode.HALF_UP)));
                    }
                }else {

                    Participant newParticipant = new Participant();
                    newParticipant.setExpense(expense);
                    newParticipant.setUser(participantUser);
                    if(status==Status.EQUAL){
                        newParticipant.setValue(equalsAmount);
                    }
                    else {
                        newParticipant.setPercent(participantRequest.getPercent());
                        newParticipant.setValue(amount.multiply(participantRequest.getPercent().divide(new BigDecimal("100"),2,RoundingMode.HALF_UP)));
                    }
                    participantRepository.save(newParticipant);
                }
            }

            expenseRepository.save(expense);
            BaseResponse response = new BaseResponse();
            response.setMessage("Expense updated successfully");
            return response;
        }
        catch (ResourceNotFoundException | AccessDeniedException| BadRequestException e){
            log.error("An error occurred in editExpense method {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in editExpense method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public BaseResponse deleteExpense(Expense expense) {
        try {
            User currentUser = SecurityUtils.getCurrentPrincipal().getUser();

            Group group = expense.getGroup();

            GroupMember groupMember = groupMemberRepository.findByGroupAndUser(group.getId().toString(), currentUser.getId().toString())
                    .orElseThrow(()-> new AccessDeniedException("You are not member in this group. So can't delete expense"));

            if(groupMember.isDeleted()){
                throw new AccessDeniedException("You are no longer member in this group. So can't delete expense");
            }

            expense.setDeleted(true);
            List<Participant> participants = participantRepository.getParticipantsByExpenseId(expense.getId().toString());
            for(Participant participant : participants){
                participant.setDeleted(true);
            }
            participantRepository.saveAll(participants);
            expenseRepository.save(expense);
            log.info("Expense Deleted with description {}", expense.getDescription());
            BaseResponse response = new BaseResponse();
            response.setMessage("Expense deleted successfully");
            return response;
        } catch (Exception e) {
            log.error("An unexpected error occurred in deleteExpense method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<MemberBalance> getMemberBalances() {
        try {
            List<MemberBalance> responses = new ArrayList<>();
            List<User> users = userRepository.getAllUsers();

            for(User user : users){
                MemberBalance response = new MemberBalance();
                response.setName(user.getName());
                List<Expense> paidExpense = expenseRepository.findPaidExpense(user.getId().toString());
                BigDecimal totalPaid = BigDecimal.ZERO;
                for(Expense expense : paidExpense){
                    totalPaid = totalPaid.add(expense.getAmount());
                }
                log.info("total paid {}", totalPaid);
                response.setTotalPaid(totalPaid);

                BigDecimal totalShare = BigDecimal.ZERO;
                List<Participant> participants = participantRepository.getParticipants(user.getId().toString());
                for(Participant participant : participants){
                    totalShare = totalShare.add(participant.getValue());
                }
                response.setTotalShare(totalShare);
                BigDecimal netBalance = totalPaid.subtract(totalShare);
                response.setNetBalance(netBalance);
                if(netBalance.compareTo(BigDecimal.ZERO)==0){
                    response.setStatus(MemberBalanceStatus.SETTLED);
                }
                else if(netBalance.compareTo(BigDecimal.ZERO)>0){
                    response.setStatus(MemberBalanceStatus.RECEIVE);
                }
                else{
                    response.setStatus(MemberBalanceStatus.OWES);
                }
                responses.add(response);
            }
            return responses;
        } catch (Exception e) {
            log.error("An unexpected error occurred in getMemberBalances method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }


}
