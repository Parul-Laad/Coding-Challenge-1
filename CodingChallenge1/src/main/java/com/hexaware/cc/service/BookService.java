package com.hexaware.cc.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hexaware.cc.dao.BookRepository;
import com.hexaware.cc.dto.BookDTO;
import com.hexaware.cc.entity.Book;
import com.hexaware.cc.exception.BookAlreadyExistsException;
import com.hexaware.cc.exception.BookNotFoundException;


@Service
public class BookService {
	@Autowired
    private BookRepository bookRepository;

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookByIsbn(int isbn) {
    	
    	
        return bookRepository.findById(isbn)
                .orElseThrow(() -> new BookNotFoundException("Book with ISBN " + isbn + " not found."));
    }

    public Book addBook(Book book) {
        if (bookRepository.existsById(book.getIsbn())) {
            throw new BookAlreadyExistsException("Book with ISBN " + book.getIsbn() + " already exists.");
        }
        return bookRepository.save(book);
    }

    public Book updateBook(int isbn, Book bookDetails) {
    	 Book book = bookRepository.findById(isbn)
                 .orElseThrow(() -> new BookNotFoundException("Cannot update. Book with ISBN " + isbn + " does not exist."));

         // Update book details
         book.setTitle(bookDetails.getTitle());
         book.setAuthor(bookDetails.getAuthor());
         book.setPublicationYear(bookDetails.getPublicationYear());

         return bookRepository.save(book);
    }

    public void deleteBook(int isbn) {
    	Book book = bookRepository.findById(isbn)
                .orElseThrow(() -> new BookNotFoundException("Cannot delete. Book with ISBN " + isbn + " does not exist."));

        bookRepository.delete(book);
    }
    
 // Convert DTO to Entity
    public Book convertToEntity(BookDTO bookDTO) {
        Book book = new Book();
        book.setIsbn(bookDTO.getIsbn());
        book.setTitle(bookDTO.getTitle());
        book.setAuthor(bookDTO.getAuthor());
        book.setPublicationYear(bookDTO.getPublicationYear());
        return book;
    }

    // Convert Entity to DTO
    public BookDTO convertToDTO(Book book) {
        BookDTO bookDTO = new BookDTO();
        bookDTO.setIsbn(book.getIsbn());
        bookDTO.setTitle(book.getTitle());
        bookDTO.setAuthor(book.getAuthor());
        bookDTO.setPublicationYear(book.getPublicationYear());
    
        return bookDTO;
    }

}
 