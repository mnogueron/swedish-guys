package com.swedishguys.server.domain;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import java.util.Objects;

/**
 * A Follower.
 */
@Entity
@Table(name = "follower")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
public class Follower implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @ManyToMany
    @Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
    @NotNull
    @JoinTable(name = "follower_blog",
               joinColumns = @JoinColumn(name="followers_id", referencedColumnName="ID"),
               inverseJoinColumns = @JoinColumn(name="blogs_id", referencedColumnName="ID"))
    private Set<Blog> blogs = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Set<Blog> getBlogs() {
        return blogs;
    }

    public void setBlogs(Set<Blog> blogs) {
        this.blogs = blogs;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        Follower follower = (Follower) o;
        if(follower.id == null || id == null) {
            return false;
        }
        return Objects.equals(id, follower.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "Follower{" +
            "id=" + id +
            ", email='" + email + "'" +
            '}';
    }
}
