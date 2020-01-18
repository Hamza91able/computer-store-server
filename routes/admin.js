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
router.get('/get-pending-orders', isAuth, adminController.getPendingOrders);
router.get('/get-completed-orders', isAuth, adminController.getCompletedOrders);
router.get('/get-order/:orderId', isAuth, adminController.getOrder);
router.post('/mark-as-delievered', isAuth, adminController.markAsDelievered);
router.post('/delete-banner', isAuth, adminController.deleteBanner);
router.post('/put-on-sale', isAuth, adminController.putOnSale);
router.get('/end-sale/:prodId', isAuth, adminController.endSale);
router.post('/change-banner-link', isAuth, adminController.addLinkToBanner);

module.exports = router;