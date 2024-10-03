import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Button, Modal, Form, Header, Divider, Table, Icon, Loader } from 'semantic-ui-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AdminDashboard = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [bookForm, setBookForm] = useState({ isbn: '', title: '', author: '', publicationYear: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [action, setAction] = useState('add'); 
  const [fetching, setFetching] = useState(false); 
  const navigate = useNavigate();

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookForm({ ...bookForm, [name]: value });
  };

  const handleAddBook = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('http://localhost:8080/api/books/addbook', bookForm, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  const handleUpdateBook = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8080/api/books/updatebookbyisbn/${selectedBook.isbn}`, bookForm, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
        },
      });
      resetForm();
      fetchBooks();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  const handleDeleteBook = async (isbn) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8080/api/books/deletebookbyisbn/${isbn}`, {
        headers: {
          Authorization: token,
        },
      });
      fetchBooks();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const resetForm = () => {
    setBookForm({ isbn: '', title: '', author: '', publicationYear: '' });
    setSelectedBook(null);
    setModalOpen(false);
  };

  const openUpdateModal = (book) => {
    setSelectedBook(book);
    setBookForm(book);
    setAction('update');
    setModalOpen(true);
  };

  const openAddModal = () => {
    resetForm();
    setAction('add');
    setModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/'); 
  };

  return (
    <div className="admin-dashboard">
      <Header as='h2' style={{ display: 'flex', justifyContent: 'center' }}>
        Admin Dashboard
        <Button className="logout-button" color='red' onClick={handleLogout}>Logout</Button>
      </Header>

      <div className="add-book-button">
        <Button color='green' onClick={openAddModal}>
          <Icon name='plus' /> Add Book
        </Button>
      </div>
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
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {books.map((book) => (
              <Table.Row key={book.isbn}>
                <Table.Cell>{book.isbn}</Table.Cell>
                <Table.Cell>{book.title}</Table.Cell>
                <Table.Cell>{book.author}</Table.Cell>
                <Table.Cell>{book.publicationYear}</Table.Cell>
 <Table.Cell>
                  <Button color='blue' icon onClick={() => openUpdateModal(book)}>
                    <Icon name='edit' /> Update
                  </Button>
                  <Button color='red' icon onClick={() => handleDeleteBook(book.isbn)}>
                    <Icon name='trash' /> Delete
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}

      <Divider />

      
      <Modal open={modalOpen} onClose={resetForm} size='small'>
        <Modal.Header>{action === 'add' ? 'Add Book' : 'Update Book'}</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='ISBN'
              name='isbn'
              value={bookForm.isbn}
              onChange={handleInputChange}
              required
            />
            <Form.Input
              label='Title'
              name='title'
              value={bookForm.title}
              onChange={handleInputChange}
              required
            />
            <Form.Input
              label='Author'
              name='author'
              value={bookForm.author}
              onChange={handleInputChange}
              required
            />
            <Form.Input
              label='Publication Year'
              name='publicationYear'
              value={bookForm.publicationYear}
              onChange={handleInputChange}
              required
            />
            <Button color='blue' onClick={action === 'add' ? handleAddBook : handleUpdateBook}>
              {action === 'add' ? 'Add Book' : 'Update Book'}
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default AdminDashboard;