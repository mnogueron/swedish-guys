package com.swedishguys.server.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.swedishguys.server.domain.Blog;
import com.swedishguys.server.domain.Follower;
import com.swedishguys.server.repository.BlogRepository;
import com.swedishguys.server.repository.FollowerRepository;
import com.swedishguys.server.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * REST controller for managing Follower.
 */
@RestController
@RequestMapping("/api")
public class FollowerResource {

    private final Logger log = LoggerFactory.getLogger(FollowerResource.class);

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private BlogRepository blogRepository;

    public static class PublicFollower implements Serializable {
        public Long id;
        public String email;
        public ArrayList<String> subscriptions = new ArrayList<>();

        public PublicFollower(){}

        public PublicFollower(Follower f) {
            id = f.getId();
            email = f.getEmail();
            for(Blog b : f.getBlogs()){
                subscriptions.add(b.getUser().getLogin());
            }
        }

        public void setId(Long id){
            this.id = id;
        }

        public void setEmail(String email){
            this.email = email;
        }

        public void setSubscriptions(ArrayList<String> subscriptions){
            this.subscriptions = subscriptions;
        }
    }

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
     * POST  /followers/public : Create a new follower.
     *
     * @param publicFollower the follower to create
     * @return the ResponseEntity with status 201 (Created) and with body the new follower, or with status 400 (Bad Request) if the follower has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/followers/public",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PublicFollower> createPublicFollower(@Valid @RequestBody PublicFollower publicFollower) throws URISyntaxException {
        log.debug("REST request to save Follower : {}", publicFollower);
        if (publicFollower.id != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("follower", "idexists", "A new follower cannot already have an ID")).body(null);
        }
        Follower follower = new Follower();
        follower.setEmail(publicFollower.email);
        Set<Blog> followerBlogs = new HashSet<>();
        List<Blog> blogs = blogRepository.findAll();
        for(Blog b : blogs){
            if(publicFollower.subscriptions.contains(b.getUser().getLogin())){
                followerBlogs.add(b);
            }
        }
        follower.setBlogs(followerBlogs);

        Follower result = followerRepository.save(follower);
        PublicFollower publicResult = new PublicFollower(result);
        return ResponseEntity.created(new URI("/api/followers/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("follower", result.getId().toString()))
            .body(publicResult);
    }

    @RequestMapping(value = "/followers/public",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PublicFollower> updatePublicFollower(@Valid @RequestBody PublicFollower publicFollower) throws URISyntaxException {
        log.debug("REST request to update Follower : {}", publicFollower);
        List<Blog> blogs = blogRepository.findAll();
        Follower follower = followerRepository.findOneByEmailWithEagerRelationships(publicFollower.email);

        if(follower != null){
            // remove old subscription
            for(Blog b : follower.getBlogs()){
                if(!publicFollower.subscriptions.contains(b.getUser().getLogin())){
                    follower.getBlogs().remove(b);
                }
            }

            // add new
            for(Blog b : blogs){
                if(publicFollower.subscriptions.contains(b.getUser().getLogin())){
                    follower.getBlogs().add(b);
                }
            }
        }
        Follower result = followerRepository.save(follower);
        PublicFollower publicResult = new PublicFollower(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("follower", follower.getId().toString()))
            .body(publicResult);

    }

    /**
     * GET  /followers/public/:id : get the "id" follower.
     *
     * @param id the id of the follower to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the follower, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/followers/public/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PublicFollower> getPublicFollower(@PathVariable Long id) {
        log.debug("REST request to get Follower : {}", id);
        Follower follower = followerRepository.findOneWithEagerRelationships(id);
        PublicFollower publicFollower = (follower != null)?new PublicFollower(follower):null;
        return Optional.ofNullable(publicFollower)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
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

    @RequestMapping(value = "/followers/findByEmail/{email:.*}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<PublicFollower> getFollowerByEmail(@PathVariable String email) {
        log.debug("REST request to get Follower by email: {}", email);
        Follower follower = followerRepository.findOneByEmailWithEagerRelationships(email);
        PublicFollower publicFollower = (follower != null)?new PublicFollower(follower):null;
        return Optional.ofNullable(publicFollower)
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

    /**
     * DELETE  /followers/deleteByEmail/:email : delete the "email" follower.
     *
     * @param email the id of the follower to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/followers/deleteByEmail/{email}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteFollowerByEmail(@PathVariable String email) {
        log.debug("REST request to delete Follower with email: {}", email);
        Follower follower = followerRepository.findOneByEmailWithEagerRelationships(email);
        if(follower != null){
            followerRepository.delete(follower.getId());
            return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("follower", follower.getId().toString())).build();
        }
        else{
            return ResponseEntity.notFound().build();
        }
    }

}
