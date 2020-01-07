const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.get('/get-categories', adminController.getCategories);

module.exports = router;