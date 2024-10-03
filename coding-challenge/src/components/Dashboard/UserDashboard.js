import React, { useState, useEffect } from 'react';
import { Button, Form, Header, Divider, Table, Icon, Loader } from 'semantic-ui-react';
import axios from 'axios';
import './UserDashboard.css';

const UserDashboard = () => {
  const [books, setBooks] = useState([]);
  const [isbn, setIsbn] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [fetching, setFetching] = useState(false);
  const [fetchingSingleBook, setFetchingSingleBook] = useState(false); 

  
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setFetching(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get('http://localhost:8080/api/books/getallbooks', {
        headers: {
          Authorization: token,
        },
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setFetching(false);
    }
  };

  const handleSearchByIsbn = async () => {
    setFetchingSingleBook(true);
    const token = localStorage.getItem('token');
    try {
      const response = await axios.get(`http://localhost:8080/api/books/getbookbyisbn/${isbn}`, {
        headers: {
          Authorization: token,
        },
      });
      setSelectedBook(response.data);
    } catch (error) {
      console.error('Error fetching book by ISBN:', error);
    } finally {
      setFetchingSingleBook(false);
    }
  };

  const handleInputChange = (e) => {
    setIsbn(e.target.value);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  return (
    <div className="user-dashboard">
      <Header as='h2' style={{ display: 'flex', justifyContent: 'center' }}>
        User Dashboard
        <Button className="logout-button" color='red' onClick={handleLogout}>Logout</Button>
      </Header>

      <Divider />

      {/* Search by ISBN Section */}
      <Header as='h3'>Search Book by ISBN</Header>
      <Form onSubmit={handleSearchByIsbn}>
        <Form.Input
          placeholder='Enter ISBN'
          value={isbn}
          onChange={handleInputChange}
          required
        />
        <Button color='blue' type='submit'>
          <Icon name='search' /> Search
        </Button>
      </Form>

      {fetchingSingleBook ? (
        <Loader active inline='centered'>Searching...</Loader>
      ) : selectedBook && (
        <div className="book-details">
          <h4>Book Details</h4>
          <p><strong>ISBN:</strong> {selectedBook.isbn}</p>
          <p><strong>Title:</strong> {selectedBook.title}</p>
          <p><strong>Author:</strong> {selectedBook.author}</p>
          <p><strong>Publication Year:</strong> {selectedBook.publicationYear}</p>
        </div>
      )}

      <Divider />

      
      <Header as='h3'>All Books</Header>
      {fetching ? (
        <Loader active inline='centered'>Loading books...</Loader>
      ) : (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>ISBN</Table.HeaderCell>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Author</Table.HeaderCell>
              <Table.HeaderCell>Publication Year</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {books.map((book) => (
              <Table.Row key={book.isbn}>
                <Table.Cell>{book.isbn}</Table.Cell>
                <Table.Cell>{book.title}</Table.Cell>
                <Table.Cell>{book.author}</Table.Cell>
                <Table.Cell>{book.publicationYear}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </div>
  );
};

export default UserDashboard;
