package com.swedishguys.server.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.swedishguys.server.domain.Entry;
import com.swedishguys.server.repository.EntryRepository;
import com.swedishguys.server.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import springfox.documentation.spring.web.json.Json;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;

/**
 * REST controller for managing Entry.
 */
@RestController
@RequestMapping("/api")
public class EntryResource {

    private final Logger log = LoggerFactory.getLogger(EntryResource.class);

    @Inject
    private EntryRepository entryRepository;

    public class PublicEntry implements Serializable {
        public String title;
        public String content;
        public ZonedDateTime date;
        public String picture;
        public String blogName;

        PublicEntry(Entry e){
            title = e.getTitle();
            content = e.getContent();
            date = e.getDate();
            picture = e.getPicture();
            blogName = e.getBlog().getName();
        }

        @Override
        public String toString() {
            return "PublicEntry{" +
                "title='" + title + "'" +
                ", content='" + content + "'" +
                ", date='" + date + "'" +
                ", picture='" + picture + "'" +
                ", blogName='" + blogName + "'" +
                '}';
        }
    }

    /**
     * POST  /entries : Create a new entry.
     *
     * @param entry the entry to create
     * @return the ResponseEntity with status 201 (Created) and with body the new entry, or with status 400 (Bad Request) if the entry has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/entries",
        method = RequestMethod.POST,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Entry> createEntry(@Valid @RequestBody Entry entry) throws URISyntaxException {
        log.debug("REST request to save Entry : {}", entry);
        if (entry.getId() != null) {
            return ResponseEntity.badRequest().headers(HeaderUtil.createFailureAlert("entry", "idexists", "A new entry cannot already have an ID")).body(null);
        }
        Entry result = entryRepository.save(entry);
        return ResponseEntity.created(new URI("/api/entries/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert("entry", result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /entries : Updates an existing entry.
     *
     * @param entry the entry to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated entry,
     * or with status 400 (Bad Request) if the entry is not valid,
     * or with status 500 (Internal Server Error) if the entry couldnt be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @RequestMapping(value = "/entries",
        method = RequestMethod.PUT,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Entry> updateEntry(@Valid @RequestBody Entry entry) throws URISyntaxException {
        log.debug("REST request to update Entry : {}", entry);
        if (entry.getId() == null) {
            return createEntry(entry);
        }
        Entry result = entryRepository.save(entry);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert("entry", entry.getId().toString()))
            .body(result);
    }

    /**
     * GET  /entries : get all the entries.
     *
     * @return the ResponseEntity with status 200 (OK) and the list of entries in body
     */
    @RequestMapping(value = "/entries",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<Entry> getAllEntries() {
        log.debug("REST request to get all Entries");
        List<Entry> entries = entryRepository.findAllWithEagerRelationships();
        return entries;
    }

    @RequestMapping(value = "/entries/last/{owner}/{nb}/{offset}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PublicEntry> getNbEntries(@PathVariable String owner, @PathVariable int nb, @PathVariable int offset) {
        log.debug("REST request to get all Entries");
        List<Entry> entries = (owner.equals("all"))?entryRepository.findAll():entryRepository.findByOwner(owner);
        Collections.sort(entries, new Comparator<Entry>() {
            @Override
            public int compare(Entry o1, Entry o2) {
                return (-1) * o1.getDate().compareTo(o2.getDate());
            }
        });

        // TODO check if the size is good
        List<PublicEntry> publicEntries = new ArrayList<>();
        if(offset < entries.size()){
            entries = entries.subList(offset, (((offset + nb) <= entries.size())?(offset+nb):entries.size()));
            for(Entry e : entries){
                publicEntries.add(new PublicEntry(e));
            }
        }
        return publicEntries;
    }

    /**
     * GET  /entries/:id : get the "id" entry.
     *
     * @param id the id of the entry to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the entry, or with status 404 (Not Found)
     */
    @RequestMapping(value = "/entries/{id}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Entry> getEntry(@PathVariable Long id) {
        log.debug("REST request to get Entry : {}", id);
        Entry entry = entryRepository.findOneWithEagerRelationships(id);
        return Optional.ofNullable(entry)
            .map(result -> new ResponseEntity<>(
                result,
                HttpStatus.OK))
            .orElse(new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    /**
     * DELETE  /entries/:id : delete the "id" entry.
     *
     * @param id the id of the entry to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @RequestMapping(value = "/entries/{id}",
        method = RequestMethod.DELETE,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        log.debug("REST request to delete Entry : {}", id);
        entryRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert("entry", id.toString())).build();
    }

}
