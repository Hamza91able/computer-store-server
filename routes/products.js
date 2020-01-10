const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/products');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/get-products-by-category/:categoryName/:order', productController.getProductByCategory);
router.get('/get-specific-product/:id', productController.getSpecificProduct);
router.get('/get-products-by-sub-category/:name/:order', productController.getProductsBySubCategory);
router.get('/get-products-by-brand/:name/:order', productController.getProductsByBrands);
router.post('/post-cart',
    [
        body("quantity")
            .isNumeric()
            .isLength({ min: 1, max: 9 })
    ],
    isAuth,
    productController.postCart
);
router.get('/get-cart', isAuth, productController.getCart);
router.post('/post-delete-from-cart', isAuth, productController.postDeleteFromCart);

module.exports = router;