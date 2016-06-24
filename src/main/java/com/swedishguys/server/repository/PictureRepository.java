package com.swedishguys.server.repository;

import com.swedishguys.server.domain.Picture;

import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * Spring Data JPA repository for the Picture entity.
 */
@SuppressWarnings("unused")
public interface PictureRepository extends JpaRepository<Picture,Long> {

    @Query("select picture from Picture picture where picture.user.login = ?#{principal.username}")
    List<Picture> findByUserIsCurrentUser();

    @Query("select distinct picture from Picture picture left join fetch picture.tags left join fetch picture.blogs")
    List<Picture> findAllWithEagerRelationships();

    @Query("select picture from Picture picture left join fetch picture.tags left join fetch picture.blogs where picture.id =:id")
    Picture findOneWithEagerRelationships(@Param("id") Long id);

}
