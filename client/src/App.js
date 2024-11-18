// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import UploadDocument from './components/Document/UploadDocument';
import ShareDocument from './components/Document/ShareDocument';
import Profile from './components/Profile/Profile';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Main from './components/Main';
import ProtectedRoutes from './components/ProtectedRoutes';
import MyDocuments from './components/Document/MyDocuments';

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route path="/my-documents" element={<ProtectedRoutes><MyDocuments/></ProtectedRoutes>} />

          <Route 
            path="/upload" 
            element={
              <ProtectedRoutes>
                <UploadDocument />
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/share" 
            element={
              <ProtectedRoutes>
                <ShareDocument />
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoutes>
                <Profile />
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/home" 
            element={
              <ProtectedRoutes>
                <Home />
              </ProtectedRoutes>
            } 
          />
          <Route 
            path="/navbar" 
            element={
              <ProtectedRoutes>
                <Navbar />
              </ProtectedRoutes>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
