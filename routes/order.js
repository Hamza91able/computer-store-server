const express = require('express');

const orderController = require('../controllers/order');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/get-user-order', isAuth, orderController.getUserOrders)

module.exports = router;