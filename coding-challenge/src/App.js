import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import Welcome from './components/Welcome/Welcome';
import AdminDashboard from './components/Dashboard/AdminDashboard';
import UserDashboard from './components/Dashboard/UserDashboard';
import ProtectedRoute from './components/utils/ProtectedRoute';

const App = () => {
  const token = localStorage.getItem('token'); // Check if user is authenticated

  return (
    
      <Routes>
        <Route path="/" element={<Welcome />} />
        
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute auth={token} role="ROLE_ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute auth={token} role="ROLE_USER">
              <UserDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    
  );
};

export default App;
