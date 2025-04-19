package com.clinic.demo.repository;

import com.clinic.demo.models.entity.user.AbstractUserEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<AbstractUserEntity, Long> {
    Optional<AbstractUserEntity> findById(Long aLong);
    Optional<AbstractUserEntity> findByEmail(String aEmail);
    Optional<AbstractUserEntity> findByPhoneNumber(String aPhoneNumber);

    List<AbstractUserEntity> findAllById(Iterable<Long> longs);
}
