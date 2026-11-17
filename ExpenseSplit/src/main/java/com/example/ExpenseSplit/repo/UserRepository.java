package com.example.ExpenseSplit.repo;

import com.example.ExpenseSplit.model.User;
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
public interface UserRepository extends JpaRepository<User, UUID> {

    @Query(value = """
select exists(select 1 from users where email=:email)
""", nativeQuery = true)
    long existsEmail(@Param("email") String email);

    @Query(value = """
select * from users where is_deleted=false
""", nativeQuery = true)
    List<User> getAllUsers();

    @Query(value = """
select * from users where lower(email) like lower(concat('%', :email, '%')) and is_deleted=false
""", nativeQuery = true)
    List<User> searchUsersByEmail(@Param("email") String email);

    @Query(value = """
select * from users where id=:id and is_deleted=false
""", nativeQuery = true)
    Optional<User> findByUserId(@Param("id") String paidBy);


    @Query(value = """
select * from users where email=:email and is_deleted=false
""", nativeQuery = true)
    Optional<User> findByEmail(String email);

    @Query(value = """
select u.* from users u where (:email is null or lower(u.email) like lower(concat('%',:email, '%')) or lower(u.name) like lower(concat('%',:email,'%')))
    and not exists(
        select 1 from group_members gm where gm.group_id=:groupId and gm.user_id=u.id and gm.is_deleted=false
    )
""",
    countQuery = """
            select count(*) from users u  where (:email is null or lower(u.email) like lower(concat('%',:email, '%')) or lower(u.name) like lower(concat('%',:email,'%')))
    and not exists(
        select 1 from group_members gm where gm.group_id=:groupId and gm.user_id=u.id and gm.is_deleted=false
            )""",
    nativeQuery = true)
    Page<User> findNonMembers(@Param("groupId") String groupId, @Param("email") String email, Pageable pageable);
}
