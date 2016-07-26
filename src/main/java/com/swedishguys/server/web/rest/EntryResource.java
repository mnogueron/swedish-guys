package com.swedishguys.server.web.rest;

import com.codahale.metrics.annotation.Timed;
import com.swedishguys.server.domain.Blog;
import com.swedishguys.server.domain.Entry;
import com.swedishguys.server.domain.Follower;
import com.swedishguys.server.domain.Tag;
import com.swedishguys.server.repository.EntryRepository;
import com.swedishguys.server.repository.FollowerRepository;
import com.swedishguys.server.service.MailService;
import com.swedishguys.server.web.rest.util.HeaderUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import javax.inject.Inject;
import javax.validation.Valid;
import java.io.Serializable;
import java.net.URI;
import java.net.URISyntaxException;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * REST controller for managing Entry.
 */
@RestController
@RequestMapping("/api")
public class EntryResource {

    private final Logger log = LoggerFactory.getLogger(EntryResource.class);

    private static final String ENTRY = "entry";

    @Inject
    private EntryRepository entryRepository;

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private MailService mailService;

    @Inject
    private MessageSource messageSource;

    @Inject
    private SpringTemplateEngine templateEngine;

    public class PublicEntry implements Serializable {
        public String title;
        public String content;
        public ZonedDateTime date;
        public String picture;
        public String blogName;
        public Set<Tag> tags;

        PublicEntry(Entry e){
            title = e.getTitle();
            content = e.getContent();
            date = e.getDate();
            picture = e.getPicture();
            blogName = e.getBlog().getName();
            log.debug("Entry sent with tags: {}", e.getTags());
            tags = e.getTags();
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

    public class PublicDate implements Serializable {
        public int year;
        public List<Integer> month = new ArrayList<>();

        PublicDate(Entry e){
            this.year = e.getDate().getYear();
            this.month.add(e.getDate().getMonthValue());
        }

        @Override
        public boolean equals(Object obj){
            if(obj == null){
                return false;
            }
            if(PublicDate.class.isAssignableFrom(obj.getClass())){
                return false;
            }
            final PublicDate other = (PublicDate)obj;
            if(other.year == this.year){
                return true;
            }
            return false;
        }
    }

    public class EntriesNumber implements Serializable {
        public int number;

        EntriesNumber(int number){
            this.number = number;
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

        // get all Follower
        List<Follower> followers = followerRepository.findAllWithEagerRelationships();
        List<Follower> followersPurged = new ArrayList<>();
        // only keep ones with same subscription as the creator of the entry
        for(int i = 0; i < followers.size(); i++){
            for(Iterator<Blog> it = followers.get(i).getBlogs().iterator(); it.hasNext(); ){
                if(it.next().getUser().getLogin().equals(entry.getBlog().getUser().getLogin())){
                    followersPurged.add(followers.get(i));
                    break;
                }
            }
        }

        // send email to all the followers
        Locale locale = Locale.forLanguageTag(entry.getBlog().getUser().getLangKey());
        Context context = new Context(locale);
        context.setVariable(ENTRY, entry);
        String content = templateEngine.process("newsletterEmail", context);
        String subject = messageSource.getMessage("email.newsletter.title", null, locale);
        for(int i = 0; i < followersPurged.size(); i++){
            mailService.sendEmail(followersPurged.get(i).getEmail(), subject, content, false, true);
        }

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

    /**
     * GET /entries/owner/nb/offset : get nb entries starting at offset from owner
     * @param owner the owner of the entries
     * @param nb the number of entries to get
     * @param offset the offset where to start
     * @return the ResponseEntity with status 200 (OK) and the list of entries in body
     */
    @RequestMapping(value = "/entries/{owner}/{nb}/{offset}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PublicEntry> getNbEntries(@PathVariable String owner, @PathVariable int nb, @PathVariable int offset) {
        log.debug("REST request to get all Entries");
        List<Entry> entries = entryRepository.findAllWithEagerRelationships();
        if(!owner.equals("all")) {
            entries = entries.stream().filter(e -> e.getBlog().getUser().getLogin().equals(owner)).collect(Collectors.toList());
        }
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

    @RequestMapping(value = "/entries/{owner}/{date}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PublicEntry> getEntriesForMonth(@PathVariable String owner, @PathVariable String date) {
        log.debug("REST request to get all Entries");
        List<Entry> entries = entryRepository.findAllWithEagerRelationships();
        int month = Integer.parseInt(date.split("-")[0]);
        int year = Integer.parseInt(date.split("-")[1]);
        if(!owner.equals("all")) {
            entries = entries.stream().filter(e -> (
                e.getBlog().getUser().getLogin().equals(owner)
                && e.getDate().getMonthValue() == month
                && e.getDate().getYear() == year
            )).collect(Collectors.toList());
        }
        Collections.sort(entries, new Comparator<Entry>() {
            @Override
            public int compare(Entry o1, Entry o2) {
                return (-1) * o1.getDate().compareTo(o2.getDate());
            }
        });

        List<PublicEntry> publicEntries = new ArrayList<>();
        for(Entry e : entries){
            publicEntries.add(new PublicEntry(e));
        }
        return publicEntries;
    }

    /**
     * GET /entries/last : Get the last five entries
     * @return the ResponseEntity with status 200 (OK) and the list of entries in body
     */
    @RequestMapping(value = "/entries/last",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PublicEntry> getLastEntries() {
        log.debug("REST request to get all youngest Entries");
        List<Entry> entries = entryRepository.findAllWithEagerRelationships();
        Collections.sort(entries, (o1, o2) -> (-1) * o1.getDate().compareTo(o2.getDate()));

        List<PublicEntry> publicEntries = new ArrayList<>();
        ArrayList<String> isInside = new ArrayList<>();
        int i=0;
        boolean done = false;
        while(i < entries.size() && !done){
            if(!isInside.contains(entries.get(i).getBlog().getUser().getLogin())){
                isInside.add(entries.get(i).getBlog().getUser().getLogin());
                publicEntries.add(new PublicEntry(entries.get(i)));
            }
            if(isInside.size() == 5){
                done = true;
            }
            i++;
        }
        return publicEntries;
    }

    @RequestMapping(value = "/entries/dates/{owner}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public List<PublicDate> getEntriesDates(@PathVariable String owner) {
        log.debug("REST request to get all Entries");
        List<Entry> entries = entryRepository.findByOwner(owner);
        Collections.sort(entries, new Comparator<Entry>() {
            @Override
            public int compare(Entry o1, Entry o2) {
                return (-1) * o1.getDate().compareTo(o2.getDate());
            }
        });

        ArrayList<PublicDate> dates = new ArrayList<>();
        ArrayList<Integer> years = new ArrayList<>();

        for(Entry e : entries){
            if(!years.contains(e.getDate().getYear())){
                dates.add(new PublicDate(e));
                years.add(e.getDate().getYear());
            }
            else{
                for(PublicDate d : dates){
                    if(d.year == e.getDate().getYear()){
                        if(!d.month.contains(e.getDate().getMonthValue())){
                            d.month.add(e.getDate().getMonthValue());
                        }
                        break;
                    }
                }
            }
        }
        return dates;
    }

    @RequestMapping(value = "/entries/number/{owner}",
        method = RequestMethod.GET,
        produces = MediaType.APPLICATION_JSON_VALUE)
    @Timed
    public EntriesNumber getEntriesNumber(@PathVariable String owner) {
        log.debug("REST request to get number of entries for user: {}", owner);
        return new EntriesNumber(entryRepository.findByOwner(owner).size());
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
