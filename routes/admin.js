const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/add-category', adminController.addCategory);

module.exports = router;