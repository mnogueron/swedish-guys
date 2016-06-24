package com.swedishguys.server.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.swedishguys.server.domain.Follower;
import com.swedishguys.server.repository.FollowerRepository;
import com.swedishguys.server.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing Follower.
 */
@RestController
@RequestMapping("/api")
public class FollowerResource {

    private final Logger log = LoggerFactory.getLogger(FollowerResource.class);
        
    @Inject
    private FollowerRepository followerRepository;
    
    /**
     * POST  /followers : Create a new follower.
     *
     * @param follower the follower to create
     * @return the ResponseEntity with status 201 (Created) and with body the new follower, or with status 400 (Bad Request) if the follower has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/followers",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Follower> createFollower(@Valid @RequestBody Follower follower) throws URISyntaxException {
        log.debug("REST request to save Follower : {}", follower);
        if (follower.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("follower", "idexists", "A new follower cannot already have an ID")).body(null);
        }
        Follower result = followerRepository.save(follower);
        return ResponseEntity.created(new URI("/api/followers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("follower", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /followers : Updates an existing follower.
     *
     * @param follower the follower to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated follower,
     * or with status 400 (Bad Request) if the follower is not valid,
     * or with status 500 (Internal Server Error) if the follower couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/followers",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Follower> updateFollower(@Valid @RequestBody Follower follower) throws URISyntaxException {
        log.debug("REST request to update Follower : {}", follower);
        if (follower.getId() == null) {
            return createFollower(follower);
        }
        Follower result = followerRepository.save(follower);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("follower", follower.getId().toString()))
            .body(result);
    }

    /**
     * GET  /followers : get all the followers.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of followers in body
     */
    @RequestMapping(value = "/followers",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Follower> getAllFollowers() {
        log.debug("REST request to get all Followers");
        List<Follower> followers = followerRepository.findAllWithEagerRelationships();
        return followers;
    }

    /**
     * GET  /followers/:id : get the "id" follower.
     *
     * @param id the id of the follower to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the follower, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/followers/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Follower> getFollower(@PathVariable Long id) {
        log.debug("REST request to get Follower : {}", id);
        Follower follower = followerRepository.findOneWithEagerRelationships(id);
        return Optional.ofNullable(follower)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /followers/:id : delete the "id" follower.
     *
     * @param id the id of the follower to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/followers/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteFollower(@PathVariable Long id) {
        log.debug("REST request to delete Follower : {}", id);
        followerRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("follower", id.toString())).build();
    }

}
