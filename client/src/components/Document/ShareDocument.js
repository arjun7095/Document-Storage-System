import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api';
import Navbar from '../Navbar';
import '../../styles/ShareDocument.css';

const ShareDocument = () => {
  const location = useLocation();
  const { documentId: selectedDocumentId, documentTitle: selectedDocumentTitle } = location.state || {};

  const [documentId, setDocumentId] = useState(selectedDocumentId || '');
  const [userId, setUserId] = useState('');
  const [documents, setDocuments] = useState([]); // To store all documents
  const [users, setUsers] = useState([]); // To store all users for sharing
  const id = localStorage.getItem('userId'); // Get the logged-in user's ID

  // Fetch all documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`/documents/my-documents/share?ownerId=${id}`); // Pass the ownerId as a query parameter
        if (Array.isArray(response.data.data)) {
          setDocuments(response.data.data);
        } else {
          console.error('Expected an array of documents but got:', response.data);
        }
      } catch (error) {
        alert('Failed to fetch documents. Please try again.');
      }
    };

    // Fetch users for sharing the document (excluding the current user)
    const fetchUsers = async () => {
      try {
        const response = await api.get('/documents/users'); // Assuming you have an endpoint to get all users
        if (Array.isArray(response.data.data)) {
          // Filter out the logged-in user from the list of users
          const filteredUsers = response.data.data.filter(user => user._id !== id);
          setUsers(filteredUsers);
        } else {
          console.error('Expected an array of users but got:', response.data);
        }
      } catch (error) {
        alert('Failed to fetch users. Please try again.');
      }
    };

    fetchDocuments();
    fetchUsers();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/documents/share', { documentId, userId });
      alert('Document shared successfully.');
      setDocumentId('');
      setUserId('');
    } catch (error) {
      alert('Document sharing failed. ' + error.response?.data || error.message);
    }
  };

  return (
    <div className="share-document-container">
      <Navbar />
      <form onSubmit={handleSubmit}>
        <h2>Share Document</h2>

        {/* Dropdown for selecting a document */}
        <select
          id="document-select"
          value={documentId}
          onChange={(e) => setDocumentId(e.target.value)}
          required
        >
          <option value="" disabled>Select a document</option>
          {documents.length > 0 ? (
            documents.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.title}
              </option>
            ))
          ) : (
            <option value="" disabled>No documents available</option>
          )}
        </select>

        {/* Pre-fill the selected document title if passed */}
        {selectedDocumentTitle && <p>Selected Document: {selectedDocumentTitle}</p>}

        {/* Dropdown for selecting a user to share with */}
        <select
          id="user-select"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          required
        >
          <option value="" disabled>Select a user</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))
          ) : (
            <option value="" disabled>No users available</option>
          )}
        </select>

        <button className="share" type="submit">Share</button>
      </form>
    </div>
  );
};

export default ShareDocument;
