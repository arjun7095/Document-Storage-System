// client/src/components/Auth/Login.js
import React, { useState } from 'react';
import api from '../../api';
import { useNavigate } from 'react-router-dom';
import '../../styles/Login.css'; // Import the scoped CSS for the login page

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', formData);
      const token = response.data.token;
      const userId = response.data.userId;
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      navigate('/home');
      alert('Login Successful');
    } catch (error) {
      if (error.response) {
        alert("Login failed: " + (error.response.data.message || "An error occurred."));
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    <div className="login-form-container">
      <button className="home-button" onClick={() => navigate('/')}>Home</button>
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <input 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleChange} 
          required 
        />
        <input 
          name="password" 
          placeholder="Password" 
          type="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Login</button>
        <p>If you don't have accont, <a href='/register'>Click here</a> to register.</p>
      </form>
    </div>
  );
};

export default Login;
