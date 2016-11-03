package com.swedishguys.server.service;

import com.swedishguys.server.domain.Blog;
import com.swedishguys.server.domain.Entry;
import com.swedishguys.server.domain.Follower;
import com.swedishguys.server.repository.FollowerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring4.SpringTemplateEngine;

import javax.inject.Inject;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;

/**
 * Created by matthieu on 03/11/16.
 */
@Service
public class FollowerService {

    private final Logger log = LoggerFactory.getLogger(FollowerService.class);

    private static final String ENTRY = "entry";
    private static final String BASE_URL = "baseUrl";

    @Inject
    private FollowerRepository followerRepository;

    @Inject
    private MailService mailService;

    @Inject
    private MessageSource messageSource;

    @Inject
    private SpringTemplateEngine templateEngine;

    @Async
    public void sendEmailToFollowers(Entry entry){
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

        String baseUrl = "http://ricm-in-sweden.com/#/unsubscribe";
        context.setVariable(BASE_URL, baseUrl);
        String content = templateEngine.process("newsletterEmail", context);
        String subject = messageSource.getMessage("email.newsletter.title", null, locale);
        for (Follower aFollowersPurged : followersPurged) {
            mailService.sendEmail(aFollowersPurged.getEmail(), subject, content, false, true);
        }
    }
}
