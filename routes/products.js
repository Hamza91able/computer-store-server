const express = require('express');
const { body } = require('express-validator/check');

const productController = require('../controllers/products');

const router = express.Router();

router.post('/post-product', productController.postProduct);

module.exports = router;