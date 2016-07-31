package com.swedishguys.server.repository;

import com.swedishguys.server.domain.Follower;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Follower entity.
 */
@SuppressWarnings("unused")
public interface FollowerRepository extends JpaRepository<Follower,Long> {

    @Query("select distinct follower from Follower follower left join fetch follower.blogs")
    List<Follower> findAllWithEagerRelationships();

    @Query("select follower from Follower follower left join fetch follower.blogs where follower.id =:id")
    Follower findOneWithEagerRelationships(@Param("id") Long id);

    @Query("select follower from Follower follower left join fetch follower.blogs where follower.email =:email")
    Follower findOneByEmailWithEagerRelationships(@Param("email") String email);

}
