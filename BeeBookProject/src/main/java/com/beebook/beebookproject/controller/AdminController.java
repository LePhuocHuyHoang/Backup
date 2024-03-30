package com.beebook.beebookproject.controller;

import com.beebook.beebookproject.common.util.AppConstants;
import com.beebook.beebookproject.common.util.AppUtils;
import com.beebook.beebookproject.payloads.*;
import com.beebook.beebookproject.payloads.request.AuthorRequest;
import com.beebook.beebookproject.payloads.request.BookRequest;
import com.beebook.beebookproject.payloads.request.TypeRequest;
import com.beebook.beebookproject.service.AuthorService;
import com.beebook.beebookproject.service.BookService;
import com.beebook.beebookproject.service.TypeService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
public class AdminController {
    private BookService bookService;
    private TypeService typeService;
    private AuthorService authorService;

    public AdminController(BookService bookService, TypeService typeService, AuthorService authorService) {
        this.bookService = bookService;
        this.typeService = typeService;
        this.authorService = authorService;
    }

    @GetMapping("/author/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public PagedResponse<AuthorRespone> getAllAuthors(
            @RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) Integer page,
            @RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) Integer size) {
        AppUtils.validatePageNumberAndSize(page, size);

        return authorService.getAllAuthors(page, size);
    }
    @PostMapping("/author")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addAuthor(@RequestBody AuthorRequest authorRequest) {
        return authorService.addAuthor(authorRequest);
    }

    @DeleteMapping("/author")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> deleteAuthor(@RequestParam(name = "authorId") Long authorId) {
        return authorService.deleteAuthor(authorId);
    }

    @GetMapping("/type/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public PagedResponse<TypeRespone> getAllTypes(
            @RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) Integer page,
            @RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) Integer size) {
        AppUtils.validatePageNumberAndSize(page, size);

        return typeService.getAllTypes(page, size);
    }

    @PostMapping("/type")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addType(@RequestBody TypeRequest typeRequest) {
        return typeService.addType(typeRequest);
    }

    @DeleteMapping("/type")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> deleteType(@RequestParam(name = "typeId") Long typeId) {
        return typeService.deleteType(typeId);
    }

    @GetMapping("/book/all")
    @PreAuthorize("hasAuthority('ADMIN')")
    public PagedResponse<BookResponse> getAllBooks(
            @RequestParam(name = "page", required = false, defaultValue = AppConstants.DEFAULT_PAGE_NUMBER) Integer page,
            @RequestParam(name = "size", required = false, defaultValue = AppConstants.DEFAULT_PAGE_SIZE) Integer size) {
        AppUtils.validatePageNumberAndSize(page, size);
        return bookService.getAllBooks(page, size);
    }

    @PostMapping("/book")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> addBook(@RequestBody BookRequest bookRequest) {
        return bookService.addBook(bookRequest);
    }

    @DeleteMapping("/book")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse> deleteBook(@RequestParam(name = "bookId") Long bookId) {
        return bookService.deleteBook(bookId);
    }
}
