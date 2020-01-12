const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post('/add-category', isAuth, adminController.addCategory);
router.post('/add-sub-category', isAuth, adminController.addSubCategory);
router.post('/add-brand', isAuth, adminController.addBrands);
router.post('/post-product', isAuth, adminController.postProduct);
router.post('/add-category-to-appbar', isAuth, adminController.addAppbarCategories);
router.post('/feature-product', isAuth, adminController.addFeaturedProduct);
router.post('/remove-from-featured', isAuth, adminController.removeFromFeatured);
router.post('/change-stock', isAuth, adminController.ChangeStock);
router.post('/change-banners', isAuth, adminController.changeBanners);
router.get('/get-pending-orders', adminController.getPendingOrders);
router.get('/get-completed-orders', adminController.getCompletedOrders);
router.get('/get-order/:orderId', adminController.getOrder);
router.post('/mark-as-delievered', isAuth, adminController.markAsDelievered);

module.exports = router;