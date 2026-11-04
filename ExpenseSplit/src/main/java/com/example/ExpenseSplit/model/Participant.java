package com.example.ExpenseSplit.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "participants",
        uniqueConstraints  = {
        @UniqueConstraint(columnNames = {"expense_id, user_id"})
})
@Getter
@Setter
public class Participant extends BaseEntity{

    @ManyToOne
    @JoinColumn(name = "expense_id", nullable = false)
    private Expense expense;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private BigDecimal percent;

    @Column(nullable = false)
    private BigDecimal value;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;
}
