const express = require('express');
const { body } = require('express-validator/check');

const productController = require('../controllers/products');

const router = express.Router();

router.get('/get-products-by-category/:categoryName/:order', productController.getProductByCategory);
router.get('/get-specific-product/:id', productController.getSpecificProduct);

module.exports = router;