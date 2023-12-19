package com.almoatasem.demo.repository;

import com.almoatasem.demo.models.entitiy.user.UserInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserInfo, Long> {
    Optional<UserInfo> findById(Long aLong);
    Optional<UserInfo> findByEmail(String aEmail);
    Optional<UserInfo> findByUsername(String aUserName);

    List<UserInfo> findAllById(Iterable<Long> longs);

}
