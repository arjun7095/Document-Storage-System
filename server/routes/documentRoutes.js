// server/routes/documentRoutes.js
const express = require('express');
const documentController = require('../controllers/documentController');
const router = express.Router();
const path = require('path');
const multer = require('multer');

// Set up multer storage and file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid file name conflicts
    }
  });
  
// Configure multer upload with storage
const upload = multer({ storage: storage });

//Routes
router.post('/upload',upload.single('file'), documentController.uploadDoc);
router.post('/share',  documentController.shareDoc);
router.get('/my-documents/share', documentController.fetchDocumentsByOwner);
router.get('/my-documents', documentController.MyDocuments);
router.get('/users', documentController.Users);
router.delete('/:docId', documentController.DeleteDocument);

module.exports = router;