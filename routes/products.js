const express = require('express');
const { body } = require('express-validator/check');

const productController = require('../controllers/products');

const router = express.Router();

router.get('/get-products-by-category/:categoryName/:order', productController.getProductByCategory);
router.get('/get-specific-product/:id', productController.getSpecificProduct);
router.get('/get-products-by-sub-category/:name/:order', productController.getProductsBySubCategory);
router.get('/get-products-by-brand/:name/:order', productController.getProductsByBrands);

module.exports = router;