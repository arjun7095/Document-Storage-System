// server/controllers/documentController.js
const User = require('../models/User');
const Document = require('../models/Document');
const mongoose = require('mongoose');
const fs = require('fs'); // File System module
const path = require('path');


//uploading the document
exports.uploadDoc = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'File not uploaded. Please upload a file.' });
    }

    const { title, userId } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;

    // Create and save the document entry in the database
    const newDocument = new Document({
      title,
      url: fileUrl,
      owner: userId,
    });

    await newDocument.save();

    res.status(200).json({ message: 'Document uploaded successfully', document: newDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

//Sharing the documents
exports.shareDoc = async (req, res) => {
  const { documentId, userId } = req.body;
  const document = await Document.findById(documentId);
  
  document.sharedWith.push(userId);
  await document.save();
  res.send("Document shared successfully");
};

//Fetching the document by ownerId at share
exports.fetchDocumentsByOwner = async (req, res) => {
  // Extract ownerId from the query parameters
  const { ownerId } = req.query;  // Assuming 'ownerId' is being sent as a query parameter

  try {
    // Fetch all documents where the owner matches the provided ownerId
    const documents = await Document.find({ owner: ownerId }).populate('owner');

    if (!documents || documents.length === 0) {
      return res.status(404).json({ message: 'No documents found for this owner.' });
    }

    // Return the found documents
    res.status(200).json({
      message: 'Documents fetched successfully.',
      data: documents,
    });
  } catch (error) {
    console.error('Error fetching documents:', error.message);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

// GET all documents by owner and check for shared documents
exports.MyDocuments=async (req, res) => {
  const { owner } = req.query;
  try {
    if (!owner) {
      return res.status(400).json({ message: 'Owner ID is required.' });
    }

    // Fetch owned documents
    const ownedDocuments = await Document.find({ owner }).populate('owner', 'name email');

    // Fetch shared documents
    const sharedDocuments = await Document.find({
      sharedWith: owner,
    }).populate('owner', 'name email');

    // Add a 'sharedBy' field only for shared documents
    const sharedDocsWithDetails = sharedDocuments.map((doc) => ({
      ...doc.toObject(),
      sharedBy: doc.owner.name || doc.owner.email,
    }));

    res.json({ ownedDocuments, sharedDocuments: sharedDocsWithDetails });
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ message: 'Failed to fetch documents' });
  }
}

// Route to delete a document by its ID
exports.DeleteDocument= async (req, res) => {
  const { docId } = req.params;

  try {
    // Find the document by ID
    const document = await Document.findById(docId);

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    // Get the file path from the document (make sure it's the relative path)
    const filePath = path.join(__dirname, '..',  document.url);

    // Delete the file from the file system
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error deleting file:', err);
        return res.status(500).json({ message: 'Failed to delete the file from the server' });
      }

      // If file is deleted, proceed to delete the document from the database
      Document.findByIdAndDelete(docId)  // Use findByIdAndDelete to delete the document from the database
        .then(() => res.status(200).json({ message: 'Document and file deleted successfully' }))
        .catch((error) => res.status(500).json({ message: 'Failed to delete the document from the database' }));
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to delete the document' });
  }
}

//Getting all users to share page
exports.Users=  async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find({}, 'name _id'); // Select only username and _id fields
    res.json({ data: users }); // Send the users data back as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch users. Please try again.' });
  }
}