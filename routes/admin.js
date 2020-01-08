const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add-category', isAuth, adminController.addCategory);
router.post('/add-sub-category', isAuth, adminController.addSubCategory);
router.post('/add-brand', isAuth, adminController.addBrands);

module.exports = router;