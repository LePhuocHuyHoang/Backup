package com.beebook.beebookproject.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity

@Table(name = "book")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "book_id")
    private Long id;

    @Column(name = "book_name", length = 255, nullable = false)
    private String name;

    @Column(name = "introduce", nullable = false)
    private String introduce;

    @Column(name = "IBSN", nullable = false)
    private Long ibsn;

    @Column(name = "publication_year", nullable = false)
    private Date publicationYear;

    @Column(name = "publisher", length = 255, nullable = false)
    private String publisher;

    @Column(name = "total_pages", nullable = false)
    private Long totalPages;

    @Column(name = "point_price", nullable = false)
    private Long pointPrice;

    @Column(name = "file_source", nullable = false)
    private String fileSource;

    @Column(name = "is_free", nullable = false)
    private Long isFree;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "author_book",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "author_id")
    )
    @JsonIgnoreProperties("books")
    private List<Author> authors = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "book_type",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "type_id")
    )
    @JsonIgnoreProperties("books")
    private List<Type> types = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "comment",
            joinColumns = @JoinColumn(name = "book_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnoreProperties("users_comment")
    @JsonIgnore
    private List<User> users_comment = new ArrayList<>();

//
//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "rating",
//            joinColumns = @JoinColumn(name = "book_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id")
//    )
//    private Set<User> users_rating;
//
//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "report",
//            joinColumns = @JoinColumn(name = "book_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id")
//    )
//    private Set<User> users_report;
//
//
//    // Định nghĩa quan hệ Many-to-Many với bảng User
//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "bookmark", // Tên của bảng trung gian
//            joinColumns = @JoinColumn(name = "book_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id")
//    )
//    private Set<User> users_bookmark;
//
//    // Định nghĩa quan hệ Many-to-Many với bảng User
//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "rental_receipt", // Tên của bảng trung gian
//            joinColumns = @JoinColumn(name = "book_id"),
//            inverseJoinColumns = @JoinColumn(name = "user_id")
//    )
//    private Set<User> users_rental;
    @Override
    public String toString() {
        return "Book{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", introduce=" + introduce +
            ", ibsn=" + ibsn +
            ", publicationYear=" + publicationYear +
            ", publisher='" + publisher + '\'' +
            ", totalPages=" + totalPages +
            ", pointPrice=" + pointPrice +
            ", fileSource=" + fileSource +
            ", isFree=" + isFree +
            ", authors=" + authors +
            '}';
}
}
