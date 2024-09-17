package com.hexaware.cc.controllers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hexaware.cc.dto.BookDTO;
import com.hexaware.cc.entity.Book;
import com.hexaware.cc.service.BookService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping("/addbook")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BookDTO> addBook(@Valid @RequestBody BookDTO bookDTO) {
        Book book = bookService.convertToEntity(bookDTO);
        Book newBook = bookService.addBook(book);
        BookDTO newBookDTO = bookService.convertToDTO(newBook);
        return new ResponseEntity<>(newBookDTO, HttpStatus.CREATED);
    }

    @GetMapping("/getallbooks")
    @PreAuthorize("hasAuthority('ROLE_USER','ROLE_USER')")
    public ResponseEntity<List<BookDTO>> getAllBooks() {
        List<Book> books = bookService.getAllBooks();
        if (books.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
        List<BookDTO> bookDTOs = new ArrayList<>();
        for (Book book : books) {
            bookDTOs.add(bookService.convertToDTO(book));
        }
        return new ResponseEntity<>(bookDTOs, HttpStatus.OK);
    }

    @GetMapping("/getbookbyisbn/{isbn}")
    @PreAuthorize("hasAuthority('ROLE_USER','ROLE_USER')")
    public ResponseEntity<BookDTO> getBookByIsbn(@PathVariable int isbn) {
    	if (isbn <= 0) {
            System.out.println("Invalid isbn. Please enter a valid isbn.");
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    	
    	Book book = bookService.getBookByIsbn(isbn);
        BookDTO bookDTO = bookService.convertToDTO(book);
        return new ResponseEntity<>(bookDTO, HttpStatus.OK);
    }

    @PutMapping("/updatebookbyisbn/{isbn}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<BookDTO> updateBook(@PathVariable int isbn, @Valid @RequestBody BookDTO bookDTO) {
        Book book = bookService.convertToEntity(bookDTO);
        Book updatedBook = bookService.updateBook(isbn, book);
        BookDTO updatedBookDTO = bookService.convertToDTO(updatedBook);
        return new ResponseEntity<>(updatedBookDTO, HttpStatus.OK);
    }

    @DeleteMapping("/deletebookbyisbn/{isbn}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<String> deleteBook(@PathVariable int isbn) {
        bookService.deleteBook(isbn);
        return new ResponseEntity<>("Book deleted successfully", HttpStatus.OK);    
        }

}
