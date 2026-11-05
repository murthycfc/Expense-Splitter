package com.example.ExpenseSplit.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expense_groups")
@Setter
@Getter
public class Group extends BaseEntity{

    @Column(nullable = false)
    private String name;

    private String description;

    @JoinColumn(nullable = false, name = "created_by")
    @ManyToOne
    private User createdBy;

    @OneToMany(mappedBy = "group", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<GroupMember> groupMembers = new ArrayList<>();

    @OneToMany(mappedBy = "group")
    private List<Expense> expenses = new ArrayList<>();
}
