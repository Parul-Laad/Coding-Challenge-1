package com.hexaware.cc.dao;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hexaware.cc.entity.Book;



@Repository
public interface BookRepository extends JpaRepository<Book, Integer> {
}