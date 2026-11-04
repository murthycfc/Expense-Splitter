package com.example.ExpenseSplit.service.impl;

import com.example.ExpenseSplit.dto.response.*;
import com.example.ExpenseSplit.enums.Status;
import com.example.ExpenseSplit.dto.request.ExpenseRequest;
import com.example.ExpenseSplit.dto.request.ParticipantRequest;
import com.example.ExpenseSplit.enums.MemberBalanceStatus;
import com.example.ExpenseSplit.exception.BadRequestException;
import com.example.ExpenseSplit.exception.ResourceNotFoundException;
import com.example.ExpenseSplit.model.Expense;
import com.example.ExpenseSplit.model.Participant;
import com.example.ExpenseSplit.model.User;
import com.example.ExpenseSplit.repo.ExpenseRepository;
import com.example.ExpenseSplit.repo.ParticipantRepository;
import com.example.ExpenseSplit.repo.UserRepository;
import com.example.ExpenseSplit.service.api.ExpenseService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
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
    @Override
    public BaseResponse addExpense(ExpenseRequest request) {
        try {
            User paidByUser = userRepository.findByUserId(request.getPaidBy()).orElseThrow(()->
                    new ResourceNotFoundException("User not found to add Paid by"));

            if(request.getDate().isAfter(LocalDate.now())){
                throw new BadRequestException("Can't create expense for future dates");
            }

            Expense expense = new Expense();
            BeanUtils.copyProperties(request, expense);
            expense.setPaidBy(paidByUser);

            Status status = request.getStatus();
            BigDecimal amount = request.getAmount();
            int participantSize = request.getParticipants().size();

            Set<String> added = new HashSet<>();
            boolean duplicate = request.getParticipants().stream().map(ParticipantRequest::getId).anyMatch(id ->!added.add(id));
            if(duplicate){
                throw new BadRequestException("Duplicate participants found");
            }

            List<Participant> participants = new ArrayList<>();
            BigDecimal totalPercent = BigDecimal.ZERO;

            if(status == Status.PERCENTAGE){
                for(ParticipantRequest participantRequest : request.getParticipants()){
                    totalPercent=totalPercent.add(participantRequest.getPercent());
                }

                log.info("total percent {}", totalPercent);
                if(totalPercent.compareTo(BigDecimal.valueOf(100))!=0){
                    throw new BadRequestException("Individual percents not equal to 100");
                }
            }

            for(ParticipantRequest participantRequest : request.getParticipants()){
                userRepository.findByUserId(participantRequest.getId()).orElseThrow(()->
                        new ResourceNotFoundException("User not found to add participant"));
            }

            for(ParticipantRequest participantRequest : request.getParticipants()){
                User participantUser = userRepository.findByUserId(participantRequest.getId()).get();
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
            expenseRepository.save(expense);
            log.info("Expense created successfully");

            BaseResponse response = new BaseResponse();
            response.setMessage("Expense created successfully");
            return response;
        }
        catch (ResourceNotFoundException e){
            log.error("An error occurred in AddExpense {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in AddExpense method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public List<ExpenseListResponse> getAllExpenses() {
        try {
            List<ExpenseListResponse> responses = new ArrayList<>();
            List<Expense> expenses = expenseRepository.findAllExpenses();
            for(Expense expense : expenses){
                ExpenseListResponse response = new ExpenseListResponse();
                BeanUtils.copyProperties(expense, response);
                response.setPaidBy(expense.getPaidBy().getName());

                List<String> participantNames = new ArrayList<>();
                for(Participant participant : expense.getParticipants()){
                    if(participant.isActive()){
                        participantNames.add(participant.getUser().getName());
                    }
                }
                response.setParticipants(participantNames);
                responses.add(response);
            }
            return responses;
        } catch (Exception e) {
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
    public BaseResponse deleteExpense(Expense expense) {
        try {
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
    @Transactional
    public BaseResponse editExpense(Expense expense, ExpenseRequest request) {
        try {
            User paidByUser = userRepository.findByUserId(request.getPaidBy()).orElseThrow(()->
                    new ResourceNotFoundException("User not found to add Paid by"));

            if(request.getDate().isAfter(LocalDate.now())){
                throw new BadRequestException("Can't update expense to future dates");
            }
            BeanUtils.copyProperties(request, expense);
            expense.setPaidBy(paidByUser);

            List<ParticipantRequest> participantRequests = request.getParticipants();

            Set<String> requestedUserIds = new HashSet<>();
            for(ParticipantRequest participantRequest : participantRequests){
                if(!requestedUserIds.add(participantRequest.getId())){
                    throw new BadRequestException("Duplicate participants found");
                }
            }

            Status status = request.getStatus();
            BigDecimal totalPercent = BigDecimal.ZERO;
            if(status == Status.PERCENTAGE){
                for(ParticipantRequest participantRequest : participantRequests){
                    totalPercent  = totalPercent.add(participantRequest.getPercent());
                }

                if(totalPercent.compareTo(BigDecimal.valueOf(100))!=0){
                    throw new BadRequestException("Individual percents not equal to 100");
                }
            }

            List<Participant> expenseParticipants = participantRepository.getExpenseParticipants(expense.getId().toString());
            log.info("Number of existing participants: {}", expenseParticipants.size());
            for(Participant participant : expenseParticipants){
                String existingUserId = participant.getUser().getId().toString();
                if(!requestedUserIds.contains(existingUserId)){
                    participant.setActive(false);
                }
            }

            for(ParticipantRequest participantRequest : participantRequests){
                userRepository.findByUserId(participantRequest.getId())
                        .orElseThrow(()-> new ResourceNotFoundException("User not found to add as participant"));
            }
            BigDecimal amount = request.getAmount();
            int participantSize = participantRequests.size();

            for(ParticipantRequest participantRequest : participantRequests){
                User participantUser = userRepository.findByUserId(participantRequest.getId()).get();
                Participant existingParticipant  = expenseParticipants.stream().filter(p->p.getUser().getId().equals(participantUser.getId()))
                        .findFirst().orElse(null);

                BigDecimal equalsAmount = amount.divide(BigDecimal.valueOf(participantSize), 2, RoundingMode.HALF_UP);

                if(existingParticipant!=null){
                    existingParticipant.setActive(true);
                    if(status==Status.EQUAL){
                        existingParticipant.setValue(equalsAmount);
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
        catch (ResourceNotFoundException | BadRequestException e){
            log.error("An error occurred in editExpense method {}", e.getMessage());
            throw e;
        }
        catch (Exception e) {
            log.error("An unexpected error occurred in editExpense method {}", e.getMessage());
            throw new BadRequestException(e.getMessage());
        }
    }

    @Override
    public ExpenseResponse getExpense(Expense expense) {
        try {
            ExpenseResponse response = new ExpenseResponse();
            BeanUtils.copyProperties(expense, response);
            response.setPaidBy(expense.getPaidBy().getId().toString());
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
}
