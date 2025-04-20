package com.clinic.demo.repository;

import com.clinic.demo.models.entity.user.BaseUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<BaseUserEntity, Long> {
    Optional<BaseUserEntity> findById(Long aLong);
    Optional<BaseUserEntity> findByEmail(String aEmail);
    Optional<BaseUserEntity> findByPhoneNumber(String aPhoneNumber);

    List<BaseUserEntity> findAllById(Iterable<Long> longs);
}
