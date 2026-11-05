package com.example.ExpenseSplit.repo;

import com.example.ExpenseSplit.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface GroupRepository extends JpaRepository<Group, UUID> {
    @Query(value = """
select * from expense_groups where id=:groupId and is_deleted=false
""", nativeQuery = true)
    Optional<Group> findByGroupId(@Param("groupId") String groupId);

    @Query(value = """
select eg.* from expense_groups eg join group_members gm on eg.id=gm.group_id and gm.user_id=:userId and gm.is_deleted=false
""", nativeQuery = true)
    List<Group> getGroups(@Param("userId") String userId);
}
