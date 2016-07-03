package com.swedishguys.server.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.swedishguys.server.domain.Picture;
import com.swedishguys.server.repository.PictureRepository;
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
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;

/**
 * REST controller for managing Picture.
 */
@RestController
@RequestMapping("/api")
public class PictureResource {

    private final Logger log = LoggerFactory.getLogger(PictureResource.class);

    @Inject
    private PictureRepository pictureRepository;

    public class PublicPicture implements Serializable{
        public String url;
        public String user;

        PublicPicture(Picture p){
            url = p.getUrl();
            user = p.getUser().getLogin();
        }
    }

    /**
     * POST  /pictures : Create a new picture.
     *
     * @param picture the picture to create
     * @return the ResponseEntity with status 201 (Created) and with body the new picture, or with status 400 (Bad Request) if the picture has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/pictures",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Picture> createPicture(@Valid @RequestBody Picture picture) throws URISyntaxException {
        log.debug("REST request to save Picture : {}", picture);
        if (picture.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("picture", "idexists", "A new picture cannot already have an ID")).body(null);
        }
        Picture result = pictureRepository.save(picture);
        return ResponseEntity.created(new URI("/api/pictures/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("picture", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /pictures : Updates an existing picture.
     *
     * @param picture the picture to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated picture,
     * or with status 400 (Bad Request) if the picture is not valid,
     * or with status 500 (Internal Server Error) if the picture couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/pictures",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Picture> updatePicture(@Valid @RequestBody Picture picture) throws URISyntaxException {
        log.debug("REST request to update Picture : {}", picture);
        if (picture.getId() == null) {
            return createPicture(picture);
        }
        Picture result = pictureRepository.save(picture);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("picture", picture.getId().toString()))
            .body(result);
    }

    /**
     * GET  /pictures : get all the pictures.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of pictures in body
     */
    @RequestMapping(value = "/pictures",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Picture> getAllPictures() {
        log.debug("REST request to get all Pictures");
        List<Picture> pictures = pictureRepository.findAllWithEagerRelationships();
        return pictures;
    }

    /**
     * GET  /pictures : get the last pictures.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of pictures in body
     */
    @RequestMapping(value = "/pictures/last/{nb}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PublicPicture> getLastPictures(@PathVariable int nb) {
        log.debug("REST request to get all Pictures");
        List<Picture> pictures = pictureRepository.findAllWithEagerRelationships();
        Collections.sort(pictures, (o1, o2) -> (-1) * o1.getDate().compareTo(o2.getDate()));

        List<PublicPicture> publicPictures = new ArrayList<>();
        for(int i = 0; i < nb && i < pictures.size(); i++){
            publicPictures.add(new PublicPicture(pictures.get(i)));
        }
        return publicPictures;
    }

    /**
     * GET  /pictures/:id : get the "id" picture.
     *
     * @param id the id of the picture to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the picture, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/pictures/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Picture> getPicture(@PathVariable Long id) {
        log.debug("REST request to get Picture : {}", id);
        Picture picture = pictureRepository.findOneWithEagerRelationships(id);
        return Optional.ofNullable(picture)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /pictures/:id : delete the "id" picture.
     *
     * @param id the id of the picture to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/pictures/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deletePicture(@PathVariable Long id) {
        log.debug("REST request to delete Picture : {}", id);
        pictureRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("picture", id.toString())).build();
    }

}
