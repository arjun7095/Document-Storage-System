// client/src/components/Document/UploadDocument.js
import React, { useState } from 'react';
import api from '../../api';
import Navbar from '../Navbar';
import '../../styles/UploadDocument.css';
import { useNavigate } from 'react-router-dom';

const UploadDocument = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate=useNavigate('');

  const handleFileChange = (e) => setFile(e.target.files[0]);
  const userId=localStorage.getItem('userId')
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('file', file);
    formData.append('userId',userId)
  
    try {
      const token = localStorage.getItem('token');  // Get the token from local storage or wherever you store it
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`,  // Send the token in the header
        },
      });
  
      alert("Document uploaded successfully.");
      setTitle('');
      setFile(null);
      setErrorMessage('');
      navigate('/my-documents')
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message || "Upload failed.");
      } else {
        setErrorMessage("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <>
    <div className='upload-document-container'>
    <Navbar/>

    <form onSubmit={handleSubmit}>
      <h2>Upload Document</h2>
      <input
        type="text"
        placeholder="Document Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        type="file"
        onChange={handleFileChange}
        required
      />
      <button className='upload' type="submit">Upload</button>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </form>
    </div>
    </>
  );
};

export default UploadDocument;
