const express = require('express');
const { submitRequestLoad, getAllRequestLoads } = require('../controllers/requestLoadController');
const router = express.Router();

router.post('/', submitRequestLoad);
router.get('/', getAllRequestLoads);

module.exports = router;
