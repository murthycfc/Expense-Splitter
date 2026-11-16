package com.example.ExpenseSplit.repo;

import com.example.ExpenseSplit.model.Expense;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, UUID> {
    @Query(value = """
select * from expenses where is_deleted=false
""", nativeQuery = true)
    List<Expense> findAllExpenses();

    @Query(value = """
select * from expenses where group_id=:groupId and  paid_by_id=:payerId and is_deleted=false
""", nativeQuery = true)
    List<Expense> findPaidExpenses(@Param("groupId") String groupId, @Param("payerId") String payerId);


    @Query(value = """
select * from expenses where id=:expenseId and is_deleted=false
""", nativeQuery = true)
    Optional<Expense> findExpenseById(@Param("expenseId") String expenseId);

    @Query(value = """
select * from expenses where group_id=:groupId and is_deleted=false
""",
            countQuery = "select count(*) from expenses where group_id=:groupId and is_deleted=false",
            nativeQuery = true)
    Page<Expense> findExpensesByGroup(@Param("groupId") String groupId, Pageable pageable);

}
