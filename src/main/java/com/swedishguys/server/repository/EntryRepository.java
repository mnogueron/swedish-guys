package com.swedishguys.server.repository;

import com.swedishguys.server.domain.Entry;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Entry entity.
 */
@SuppressWarnings("unused")
public interface EntryRepository extends JpaRepository<Entry,Long> {

    @Query("select distinct entry from Entry entry left join fetch entry.tags")
    List<Entry> findAllWithEagerRelationships();

    @Query("select distinct entry from Entry entry left join fetch entry.tags where entry.published = TRUE")
    List<Entry> findAllPublishedWithEagerRelationships();

    @Query("select entry from Entry entry left join fetch entry.tags where entry.id =:id")
    Entry findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select entry from Entry entry where entry.blog.user.login =:owner")
    List<Entry> findByOwner(@Param("owner") String owner);

    @Query("select entry from Entry entry where entry.blog.user.login =:owner and entry.published = TRUE")
    List<Entry> findPublishedByOwner(@Param("owner") String owner);
}
