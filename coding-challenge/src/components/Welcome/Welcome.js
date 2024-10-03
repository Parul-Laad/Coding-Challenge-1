// // Welcome.js
// import React from 'react';
// import './Welcome.css';
// import { Button } from 'semantic-ui-react';
// import { useNavigate } from 'react-router-dom';

// const Welcome = () => {
//   const navigate = useNavigate();

//   return (
//     <div className="welcome-container">
//       <h1 className="welcome-title">Welcome to the Library Management System</h1>
//       <p className="welcome-description">
//         Discover a world of knowledge and information. Access thousands of books, 
//         journals, and articles at your fingertips. Join us in your journey of 
//         exploration and learning.
//       </p>
//       <Button 
//         className="welcome-button" 
//         primary 
//         onClick={() => navigate('/login')}
//       >
//         Login
//       </Button>
//       <Button 
//         className="welcome-button" 
//         secondary 
//         onClick={() => navigate('/register')}
//       >
//         Register
//       </Button>
//     </div>
//   );
// };

// export default Welcome;


// Welcome.js
import React, { useState } from 'react';
import './Welcome.css';
import { Button, Modal, Form } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();
  
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [registerData, setRegisterData] = useState({ uid: '', name: '', email: '', password: '', roles: '' });
  
  // State to store registration response message
  const [registerResponse, setRegisterResponse] = useState('');

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleLoginSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/generateToken', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      if (response.ok) {
        localStorage.setItem('token', result.token);
        localStorage.setItem('role', result.role);
        navigate(result.role.includes('ROLE_ADMIN') ? '/admin/dashboard' : '/user/dashboard');
        setLoginModalOpen(false);
      } else {
        alert('Login failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  const handleRegisterSubmit = async () => {
    try {
      const response = await fetch('http://localhost:8080/auth/addNewUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      const result = await response.text(); // Change to text() to get the response string
      if (response.ok) {
        setRegisterResponse(result); // Set the response string to state
      } else {
        setRegisterResponse('Registration failed: ' + result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  return (
    <div className="welcome-container">
      <h1 className="welcome-title">Welcome to the Library Management System</h1>
      <p className="welcome-description">
        Discover a world of knowledge and information. Access thousands of books, 
        journals, and articles at your fingertips. Join us in your journey of 
        exploration and learning.
      </p>
      <Button 
        className="welcome-button" 
        primary 
        onClick={() => setLoginModalOpen(true)}
      >
        Login
      </Button>
      <Button 
        className="welcome-button" 
        secondary 
        onClick={() => setRegisterModalOpen(true)}
      >
        Register
      </Button>

      {/* Login Modal */}
      <Modal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
        size='small'
      >
        <Modal.Header>Login</Modal.Header>
        <Modal.Content>
          <Form>
            <Form.Input
              label='Username'
              name='username'
              value={loginData.username}
              onChange={handleLoginChange}
              required
            />
            <Form.Input
              label='Password'
              type='password'
              name='password'
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <Button color='blue' type='submit' onClick={handleLoginSubmit}>Login</Button>
          </Form>
        </Modal.Content>
      </Modal>

      {/* Register Modal */}
      <Modal
        open={registerModalOpen}
        onClose={() => {
          setRegisterModalOpen(false);
          setRegisterResponse(''); // Clear response when closing modal
        }}
        size='small'
      >
        <Modal.Header>Register</Modal.Header>
        <Modal.Content>
          <Form>
            {/* <Form.Input
              label='UID'
              name='uid'
              value={registerData.uid}
              onChange={handleRegisterChange}
              required
            /> */}
            <Form.Input
              label='Name'
              name='name'
              value={registerData.name}
              onChange={handleRegisterChange}
              required
            />
            <Form.Input
              label='Email'
              name='email'
              type='email'
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
            <Form.Input
              label='Password'
              type='password'
              name='password'
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />
            <Form.Input
              label='Roles'
              name='roles'
              value={registerData.roles}
              onChange={handleRegisterChange}
              required
            />
            <Button color='green' type='submit' onClick={handleRegisterSubmit}>Register</Button>
          </Form>

          {/* Display Registration Response */}
          {registerResponse && (
            <div className="registration-response" style={{ marginTop: '10px' }}>
              <p>{registerResponse}</p>
            </div>
          )}
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default Welcome;
