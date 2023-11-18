package org.rarbg.Project1.DataAccessObject;

import org.rarbg.Project1.Entities.UserInfo;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.FluentQuery;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;

public class UserRepositoryImplementation implements UserRepositoryDAO{

    @Override
    public void flush() {

    }

    @Override
    public <S extends UserInfo> S saveAndFlush(S entity) {
        return null;
    }

    @Override
    public <S extends UserInfo> List<S> saveAllAndFlush(Iterable<S> entities) {
        return null;
    }

    @Override
    public void deleteAllInBatch(Iterable<UserInfo> entities) {

    }

    @Override
    public void deleteAllByIdInBatch(Iterable<UUID> uuids) {

    }

    @Override
    public void deleteAllInBatch() {

    }

    @Override
    public UserInfo getOne(UUID uuid) {
        return null;
    }

    @Override
    public UserInfo getById(UUID uuid) {
        return null;
    }

    @Override
    public UserInfo getReferenceById(UUID uuid) {
        return null;
    }

    @Override
    public <S extends UserInfo> Optional<S> findOne(Example<S> example) {
        return Optional.empty();
    }

    @Override
    public <S extends UserInfo> List<S> findAll(Example<S> example) {
        return null;
    }

    @Override
    public <S extends UserInfo> List<S> findAll(Example<S> example, Sort sort) {
        return null;
    }

    @Override
    public <S extends UserInfo> Page<S> findAll(Example<S> example, Pageable pageable) {
        return null;
    }

    @Override
    public <S extends UserInfo> long count(Example<S> example) {
        return 0;
    }

    @Override
    public <S extends UserInfo> boolean exists(Example<S> example) {
        return false;
    }

    @Override
    public <S extends UserInfo, R> R findBy(Example<S> example, Function<FluentQuery.FetchableFluentQuery<S>, R> queryFunction) {
        return null;
    }

    @Override
    public <S extends UserInfo> S save(S entity) {
        return null;
    }

    @Override
    public <S extends UserInfo> List<S> saveAll(Iterable<S> entities) {
        return null;
    }

    @Override
    public Optional<UserInfo> findById(UUID uuid) {
        return Optional.empty();
    }

    @Override
    public boolean existsById(UUID uuid) {
        return false;
    }

    @Override
    public List<UserInfo> findAll() {
        return null;
    }

    @Override
    public List<UserInfo> findAllById(Iterable<UUID> uuids) {
        return null;
    }

    @Override
    public long count() {
        return 0;
    }

    @Override
    public void deleteById(UUID uuid) {

    }

    @Override
    public void delete(UserInfo entity) {

    }

    @Override
    public void deleteAllById(Iterable<? extends UUID> uuids) {

    }

    @Override
    public void deleteAll(Iterable<? extends UserInfo> entities) {

    }

    @Override
    public void deleteAll() {

    }

    @Override
    public List<UserInfo> findAll(Sort sort) {
        return null;
    }

    @Override
    public Page<UserInfo> findAll(Pageable pageable) {
        return null;
    }
}
