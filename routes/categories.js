const express = require('express');

const categoriesController = require('../controllers/categories');

const router = express.Router();

router.get('/get-categories', categoriesController.getCategories);
router.get('/get-sub-categories/:category', categoriesController.getSubCategoriesAndBrands);

module.exports = router;