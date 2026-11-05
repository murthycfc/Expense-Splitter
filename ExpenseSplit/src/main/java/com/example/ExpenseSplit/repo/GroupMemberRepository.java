package com.example.ExpenseSplit.repo;

import com.example.ExpenseSplit.model.GroupMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface GroupMemberRepository extends JpaRepository<GroupMember, UUID> {
    @Query(value = """
select exists( select 1 from group_members where group_id=:groupId and user_id=:userId)
""", nativeQuery = true)
    Integer alreadyExists(@Param("groupId") String groupId, @Param("userId") String userId);

    @Query(value = """
select * from group_members where group_id=:groupId and is_deleted=false
""", nativeQuery = true)
    List<GroupMember> findMembersByGroupId(@Param("groupId") String groupId);

    @Query(value = """
select exists( select 1 from group_members where group_id=:groupId and user_id=:userId and is_deleted=false)
""", nativeQuery = true)
    Integer isUserMemberOfGroup(@Param("groupId") String groupId, @Param("userId") String userId);

    @Query(value = """
select * from group_members where group_id=:groupId and user_id=:userId and is_deleted=false
""", nativeQuery = true)
    GroupMember getMemberByGroupAndUser(@Param("groupId") String groupId, @Param("userId") String userId);
}
