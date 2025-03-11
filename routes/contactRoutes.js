const express = require('express');
const router = express.Router();
const { submitForm, getAllContacts, upload } = require('../controllers/contactController');

router.post('/', upload.single('file'), submitForm);
router.get('/', getAllContacts); 

module.exports = router;
