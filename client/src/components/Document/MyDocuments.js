import React, { useEffect, useState, useRef } from 'react';
import api from '../../api';
import Navbar from '../Navbar';
import '../../styles/MyDocuments.css';
import { useNavigate } from 'react-router-dom';

const MyDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const owner = localStorage.getItem('userId');
  const navigate = useNavigate();

  // State to track the visibility of the action menu for each document
  const [activeDocId, setActiveDocId] = useState(null);

  // Ref to handle click outside of dropdown menu to close it
  const dropdownRef = useRef(null);

  // Separate owned and shared documents
  const [ownedDocuments, setOwnedDocuments] = useState([]);
  const [sharedDocuments, setSharedDocuments] = useState([]);

  const handleDelete = async (docId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (confirmDelete) {
      try {
        await api.delete(`/documents/${docId}`);
        
        // Update ownedDocuments by removing the deleted document
        setOwnedDocuments((prevOwnedDocuments) => 
          prevOwnedDocuments.filter((doc) => doc._id !== docId)
        );
        setDocuments()
        // Update sharedDocuments if necessary (optional)
        setSharedDocuments((prevSharedDocuments) => 
          prevSharedDocuments.filter((doc) => doc._id !== docId)
        );
  
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to delete the document. Please try again later.');
      }
    }
  };
  

  const handleShare = (docId, docTitle) => {
    navigate('/share', { state: { documentId: docId, documentTitle: docTitle } });
  };

  // Toggle the action menu visibility for a document
  const toggleActionMenu = (docId) => {
    setActiveDocId((prevDocId) => (prevDocId === docId ? null : docId)); // Toggle the menu for the clicked document
  };

  // Close the dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDocId(null); // Close the dropdown if clicked outside
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`/documents/my-documents?owner=${owner}`);
        const { ownedDocuments: owned, sharedDocuments: shared } = response.data;
  
        setOwnedDocuments(owned);
        setSharedDocuments(shared);
        setErrorMessage('');
      } catch (error) {
        setErrorMessage('Failed to load documents. Please try again later.');
      }
    };
  
    fetchDocuments();
  }, [owner]);

  return (
    <>
      <div>
      <div className="documents-container">
      <Navbar />
        <h2>My Documents</h2>

        {errorMessage && documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          <>
            {/* Display Owned Documents */}
            {ownedDocuments.length > 0 && (
              <div className="owned-documents">
                <h3>Owned Documents</h3>
                <div className="card-list">
                  {ownedDocuments.map((doc) => (
                    <div key={doc._id} className="document-card">
                      <h3>{doc.title.length > 30 ? doc.title.substring(0, 30) + '...' : doc.title}</h3>
                      <p>Uploaded on: {new Date(doc.createdAt).toLocaleDateString()}</p>
                      {doc.description && (
                        <p className="document-preview">
                          {doc.description.length > 100 ? doc.description.substring(0, 100) + '...' : doc.description}
                        </p>
                      )}

                      <button className="more-options" onClick={() => toggleActionMenu(doc._id)}>
                        &#8230;
                      </button>

                      {activeDocId === doc._id && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                          <button onClick={() => handleShare(doc._id, doc.title)} className="dropdown-item">
                            Share
                          </button>
                          <button onClick={() => handleDelete(doc._id)} className="dropdown-item delete-btn">
                            Delete
                          </button>
                        </div>
                      )}

                      <a href={`http://localhost:5000${doc.url}`} target="_blank" rel="noopener noreferrer" className="document-link">
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Display Shared Documents */}
            {sharedDocuments.length > 0 && (
              <div className="shared-documents">
                <h3>Shared Documents to You</h3>
                <div className="card-list">
                  {sharedDocuments.map((doc) => (
                    <div key={doc._id} className="document-card">
                      <h3 style={{color:'rgb(35, 46, 243)'}}>{doc.title.length > 30 ? doc.title.substring(0, 30) + '...' : doc.title}</h3>
                      <p>Uploaded on: {new Date(doc.createdAt).toLocaleDateString()}</p>
                      {doc.description && (
                        <p className="document-preview">
                          {doc.description.length > 100 ? doc.description.substring(0, 100) + '...' : doc.description}
                        </p>
                      )}

                      {/* Display who shared the document */}
                      <p className="shared-by">Shared by: {doc.sharedBy}</p>

                      {/* <button className="more-options" onClick={() => toggleActionMenu(doc._id)}>
                        &#8230;
                      </button>

                      {activeDocId === doc._id && (
                        <div className="dropdown-menu" ref={dropdownRef}>
                          <button onClick={() => handleShare(`http://localhost:5000${doc.url}`)} className="dropdown-item">
                            Share
                          </button>
                        </div>
                      )} */}

                      <a href={`http://localhost:5000${doc.url}`} target="_blank" rel="noopener noreferrer" className="document-link">
                        View Document
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      </div>
    </>
  );
};

export default MyDocuments;
