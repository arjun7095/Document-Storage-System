import React, { useState } from 'react';
import api from '../../api';
import '../../styles/Register.css'; // Import the scoped CSS for the registration page
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', aadhar: '' });
  const [errors, setErrors] = useState({}); // Track validation errors
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If the field is Aadhar, format it as user types
    if (name === 'aadhar') {
      // Remove non-numeric characters and slice to 12 digits
      let formattedAadhar = value.replace(/\D/g, '').slice(0, 12);

      // Format the Aadhar number with hyphens after every 4 digits
      if (formattedAadhar.length > 4) {
        formattedAadhar = formattedAadhar.replace(/(\d{4})(\d{1,4})(\d{1,4})?/, '$1-$2-$3');
      }

      // Set the formatted value to the form data
      setFormData({ ...formData, [name]: formattedAadhar });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Clear errors as user types
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateEmail = (email) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateAadhar = (aadhar) => {
    // Aadhar number should be exactly 12 digits, including hyphens
    const aadharRegex = /^\d{4}-\d{4}-\d{4}$/;
    return aadharRegex.test(aadhar);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    let formErrors = {};

    if (!validateEmail(formData.email)) {
      formErrors.email = 'Please enter a valid email address.';
    }

    if (!validateAadhar(formData.aadhar)) {
      formErrors.aadhar = 'Aadhar number must be 12 digits in the format XXXX-XXXX-XXXX.';
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors); // Display validation errors
      return;
    }

    try {
      await api.post('/auth/register', formData);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. ' + error.response?.data || error.message);
    }
  };

  return (
    <div className="register-form-container">
      {/* Home button */}
      <button className="home-button" onClick={() => navigate('/')}>Home</button>

      <form className="register-form" onSubmit={handleSubmit}>
        <h2>Register</h2>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <p className="error">{errors.email}</p>} {/* Display email error */}

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          name="aadhar"
          placeholder="Aadhar Number"
          value={formData.aadhar}
          onChange={handleChange}
          required
        />
        {errors.aadhar && <p className="error">{errors.aadhar}</p>} {/* Display Aadhar error */}

        <button type="submit">Register</button>
        <p>If you already have an account, <a href='/login'>click here.</a></p>
      </form>
    </div>
  );
};

export default Register;
