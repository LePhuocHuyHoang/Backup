package com.beebook.beebookproject.payloads.request;

import com.beebook.beebookproject.entities.Book;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Data
@Getter @Setter
public class BookRequest{

    private Long id;
    private String name;
    private String introduce;
    private Long ibsn;
    private Date publicationYear;
    private String publisher;
    private Long totalPages;
    private Long pointPrice;
    private String fileSource;
    private boolean isFree;
    private String typeName;
    private String authorName;
    public Book toBook(){
        Book book = new Book();
        book.setName(this.name);
        book.setIbsn(this.ibsn);
        book.setPublisher(this.publisher);
        book.setIntroduce(this.introduce);
        book.setIsFree(this.isFree ? 1L : 0L);
        book.setFileSource(this.fileSource);
        book.setPointPrice(this.pointPrice);
        book.setPublicationYear(this.publicationYear);
        book.setTotalPages(this.totalPages);
        return book;
    }
}
