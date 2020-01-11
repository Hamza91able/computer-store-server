const Order = require('../models/order');

exports.getUserOrders = (req, res, next) => {

    Order
        .find({ "user.userId": req.userId })
        .then(orders => {

            res.status(200).json({
                orders: orders,
            })
        })
        .catch(err => {

            res.status(500).json({
                message: 'Internal Server Error',
            })
        })
}