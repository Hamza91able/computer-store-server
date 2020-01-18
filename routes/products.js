const express = require('express');
const { body } = require('express-validator');

const productController = require('../controllers/products');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/get-products-by-category/:categoryName/:order', productController.getProductByCategory);
router.get('/get-products-by-category-no-pagination/:categoryName', productController.getProductByCategoryNoPagination);
router.get('/get-specific-product/:id', productController.getSpecificProduct);
router.get('/get-products-by-sub-category/:name/:order', productController.getProductsBySubCategory);
router.get('/get-products-by-brand/:name/:order', productController.getProductsByBrands);
router.get('/get-out-of-stock-products/:categoryName', productController.getOutOfStockProducts);
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
router.post('/charge',
    [
        body('name')
            .notEmpty()
            .isLength({ min: 3 })
            .isString()
            .withMessage("Please enter correct name"),
        body('cardNumber')
            .isCreditCard()
            .withMessage("Please enter correct card number"),
        body('month')
            .isNumeric()
            .isLength({ min: 1, max: 2 })
            .withMessage("Month incorrect"),
        body('year')
            .isNumeric()
            .isLength({ min: 4, max: 4 })
            .withMessage("Year incorrect"),
        body('cvv')
            .isNumeric()
            .isLength({ min: 3, max: 3 })
            .withMessage("incorrect cvv"),
        body('addressLine1')
            .isString()
            .isLength({ min: 3 })
            .withMessage("Address is incorrect"),
        body('city')
            .notEmpty()
            .isString()
            .isLength({ min: 2 })
            .withMessage("incorrect city name"),
        body('state')
            .notEmpty()
            .isString()
            .isLength({ min: 2 })
            .withMessage("incorrect state name"),
        body('zip')
            .notEmpty()
            .isNumeric()
            .withMessage("incorrect zip"),
    ],
    isAuth, productController.charge
);
router.get('/get-order-recipt/:orderId', isAuth, productController.getOrderRecipt);
router.get('/get-featured-products', productController.getFeaturedProducts);
router.get('/get-banners', productController.getBanners);
router.get('/get-products-by-keyword/:keyWord', productController.searchProducts);
router.get('/get-on-sale-products', productController.getOnSaleProducts);
router.post('/review-product', isAuth, productController.saveReview);

module.exports = router;