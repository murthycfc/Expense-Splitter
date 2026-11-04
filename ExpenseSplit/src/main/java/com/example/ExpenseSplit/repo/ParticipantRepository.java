package com.example.ExpenseSplit.repo;

import com.example.ExpenseSplit.model.Participant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ParticipantRepository extends JpaRepository<Participant, UUID> {
    @Query(value = """
select * from participants where user_id=:userId and is_active=true and is_deleted=false
""", nativeQuery = true)
    List<Participant> getParticipants(@Param("userId") String userId);

    @Query(value = """
select * from participants where user_id =:userId and expense_id =:expenseId
""", nativeQuery = true)
    Optional<Participant> findById(@Param("expenseId") String expenseId, @Param("userId") String userId );

    @Query(value = """
select * from participants where expense_id=:expenseId and is_deleted=false
""", nativeQuery = true)
    List<Participant> getExpenseParticipants(@Param("expenseId") String expenseId);

    @Query(value = """
select * from participants where expense_id=:expenseId and is_active=true and is_deleted=false
""", nativeQuery = true)
    List<Participant> getActiveExpenseParticipants(@Param("expenseId") String expenseId);

    @Query(value = """
select * from participants where expense_id=:expenseId
""", nativeQuery = true)
    List<Participant> getParticipantsByExpenseId(@Param("expenseId") String expenseId);
}


