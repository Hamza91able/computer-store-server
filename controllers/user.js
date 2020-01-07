const User = require('../models/user');

exports.getUser = (req, res, next) => {
    const userId = req.body.userId;

    User
        .findById(userId)
        .then(user => {
            if (!user) {
                const error = new Error("Not Authorized");
                error.statusCode = 403;
                throw error;
            }

            res.status(200).json({
                user: user,
            })
        })
        .catch(err => {
            if (!error.statusCode) {
                error.statusCode = 500
            };
            next(err);
        })
}