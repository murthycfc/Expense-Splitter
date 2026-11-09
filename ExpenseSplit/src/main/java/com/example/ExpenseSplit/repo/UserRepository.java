package com.example.ExpenseSplit.repo;

import com.example.ExpenseSplit.model.User;
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
}
