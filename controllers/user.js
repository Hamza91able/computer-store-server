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

exports.saveUserInformation = (req, res, nxet) => {
    console.log(req.body);
    const fullName = req.body.fullName;
    const addressLine1 = req.body.addressLine1;
    const addressLine2 = req.body.addressLine2;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const phoneNumber = req.body.phoneNumber;
    const delieveryInformation = req.body.delieveryInformation

    User
        .findById(req.userId)
        .then(user => {
            user.fullName = fullName;
            user.addressLine1 = addressLine1;
            user.addressLine2 = addressLine2;
            user.city = city;
            user.state = state;
            user.zip = zip;
            user.phoneNumber = phoneNumber;
            user.delieveryInformation = delieveryInformation;

            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: 'Information saved',
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error',
            });
        });
}

exports.getDelieveryAddress = (req, res, next) => {

    User
        .findById(req.userId)
        .then(user => {
            if (!user) {
                const error = new Error("Authorization Error");
                error.statusCodee = 403;
                throw error;
            }

            res.status(200).json({
                user: {
                    fullName: user.fullName,
                    addressLine1: user.addressLine1,
                    addressLine2: user.addressLine2,
                    city: user.city,
                    state: user.state,
                    zip: user.zip,
                    phoneNumber: user.phoneNumber,
                    delieveryInformation: user.delieveryInformation,
                    email: user.email,
                }
            })
        })
        .catch(err => {
            if (err.statusCode === 403) {
                res.status(403).json({
                    message: "Error authorizating user",
                });
            } else {
                res.status(500).json({
                    message: 'Internal Server Error',
                })
            }
        })
}
