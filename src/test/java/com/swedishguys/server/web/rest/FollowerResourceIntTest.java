package com.swedishguys.server.web.rest;

import com.swedishguys.server.SwedishguysApp;
import com.swedishguys.server.domain.Follower;
import com.swedishguys.server.repository.FollowerRepository;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import static org.hamcrest.Matchers.hasItem;
import org.mockito.MockitoAnnotations;
import org.springframework.boot.test.IntegrationTest;
import org.springframework.boot.test.SpringApplicationConfiguration;
import org.springframework.http.MediaType;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * Test class for the FollowerResource REST controller.
 *
 * @see FollowerResource
 */
@RunWith(SpringJUnit4ClassRunner.class)
@SpringApplicationConfiguration(classes = SwedishguysApp.class)
@WebAppConfiguration
@IntegrationTest
public class FollowerResourceIntTest {

    private static final String DEFAULT_EMAIL = "AAAAA";
    private static final String UPDATED_EMAIL = "BBBBB";

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private MappingJackson2HttpMessageConverter jacksonMessageConverter;

    @Inject
    private PageableHandlerMethodArgumentResolver pageableArgumentResolver;

    private MockMvc restFollowerMockMvc;

    private Follower follower;

    @PostConstruct
    public void setup() {
        MockitoAnnotations.initMocks(this);
        FollowerResource followerResource = new FollowerResource();
        ReflectionTestUtils.setField(followerResource, "followerRepository", followerRepository);
        this.restFollowerMockMvc = MockMvcBuilders.standaloneSetup(followerResource)
            .setCustomArgumentResolvers(pageableArgumentResolver)
            .setMessageConverters(jacksonMessageConverter).build();
    }

    @Before
    public void initTest() {
        follower = new Follower();
        follower.setEmail(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void createFollower() throws Exception {
        int databaseSizeBeforeCreate = followerRepository.findAll().size();

        // Create the Follower

        restFollowerMockMvc.perform(post("/api/followers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(follower)))
                .andExpect(status().isCreated());

        // Validate the Follower in the database
        List<Follower> followers = followerRepository.findAll();
        assertThat(followers).hasSize(databaseSizeBeforeCreate + 1);
        Follower testFollower = followers.get(followers.size() - 1);
        assertThat(testFollower.getEmail()).isEqualTo(DEFAULT_EMAIL);
    }

    @Test
    @Transactional
    public void checkEmailIsRequired() throws Exception {
        int databaseSizeBeforeTest = followerRepository.findAll().size();
        // set the field null
        follower.setEmail(null);

        // Create the Follower, which fails.

        restFollowerMockMvc.perform(post("/api/followers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(follower)))
                .andExpect(status().isBadRequest());

        List<Follower> followers = followerRepository.findAll();
        assertThat(followers).hasSize(databaseSizeBeforeTest);
    }

    @Test
    @Transactional
    public void getAllFollowers() throws Exception {
        // Initialize the database
        followerRepository.saveAndFlush(follower);

        // Get all the followers
        restFollowerMockMvc.perform(get("/api/followers?sort=id,desc"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.[*].id").value(hasItem(follower.getId().intValue())))
                .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL.toString())));
    }

    @Test
    @Transactional
    public void getFollower() throws Exception {
        // Initialize the database
        followerRepository.saveAndFlush(follower);

        // Get the follower
        restFollowerMockMvc.perform(get("/api/followers/{id}", follower.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.id").value(follower.getId().intValue()))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL.toString()));
    }

    @Test
    @Transactional
    public void getNonExistingFollower() throws Exception {
        // Get the follower
        restFollowerMockMvc.perform(get("/api/followers/{id}", Long.MAX_VALUE))
                .andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    public void updateFollower() throws Exception {
        // Initialize the database
        followerRepository.saveAndFlush(follower);
        int databaseSizeBeforeUpdate = followerRepository.findAll().size();

        // Update the follower
        Follower updatedFollower = new Follower();
        updatedFollower.setId(follower.getId());
        updatedFollower.setEmail(UPDATED_EMAIL);

        restFollowerMockMvc.perform(put("/api/followers")
                .contentType(TestUtil.APPLICATION_JSON_UTF8)
                .content(TestUtil.convertObjectToJsonBytes(updatedFollower)))
                .andExpect(status().isOk());

        // Validate the Follower in the database
        List<Follower> followers = followerRepository.findAll();
        assertThat(followers).hasSize(databaseSizeBeforeUpdate);
        Follower testFollower = followers.get(followers.size() - 1);
        assertThat(testFollower.getEmail()).isEqualTo(UPDATED_EMAIL);
    }

    @Test
    @Transactional
    public void deleteFollower() throws Exception {
        // Initialize the database
        followerRepository.saveAndFlush(follower);
        int databaseSizeBeforeDelete = followerRepository.findAll().size();

        // Get the follower
        restFollowerMockMvc.perform(delete("/api/followers/{id}", follower.getId())
                .accept(TestUtil.APPLICATION_JSON_UTF8))
                .andExpect(status().isOk());

        // Validate the database is empty
        List<Follower> followers = followerRepository.findAll();
        assertThat(followers).hasSize(databaseSizeBeforeDelete - 1);
    }
}
