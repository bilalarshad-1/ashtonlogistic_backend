const express = require('express');
const cookieController = require('../controllers/cookieController');

const router = express.Router();

router.get('/:userId', cookieController.getPreferences);
router.post('/', cookieController.savePreferences);

module.exports = router;