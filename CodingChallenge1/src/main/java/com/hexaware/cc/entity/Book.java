package com.hexaware.cc.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

@Entity
public class Book {

	@Id
	private int isbn;
	
    @NotBlank(message = "Title cannot be null")
    private String title;

    @NotBlank(message = "Author cannot be null")
    private String author;
    

	@Min(value = 1900, message = "Invalid publication year")
    private int publicationYear;

    public Book() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Book(int isbn, @NotBlank(message = "Title cannot be null") String title,
			@NotBlank(message = "Author cannot be null") String author,
			@Min(value = 1900, message = "Invalid publication year") int publicationYear) {
		super();
		this.isbn = isbn;
		this.title = title;
		this.author = author;
		this.publicationYear = publicationYear;
	}

	public int getIsbn() {
		return isbn;
	}

	public void setIsbn(int isbn) {
		this.isbn = isbn;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getAuthor() {
		return author;
	}

	public void setAuthor(String author) {
		this.author = author;
	}

	public int getPublicationYear() {
		return publicationYear;
	}

	public void setPublicationYear(int publicationYear) {
		this.publicationYear = publicationYear;
	}

    
    
    
    
}
