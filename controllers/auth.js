const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error("Validation Failed");
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }

    const name = req.body.name;
    const email = req.body.email.toLowerCase();
    const password = req.body.password;

    bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
            const user = new User({
                email,
                password: hashedPassword,
                name,
                isAdmin: false,
            })
            return user.save();
        })
        .then(result => {
            res.status(201).json({
                message: "User Created!",
                userId: result._id,
            })
        })
        .catch(err => {
            console.log(err);
            next(err);
        })
}

exports.checkEmail = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    User
        .findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error("Email doesn't exist");
                error.statusCode = 401;
                throw error;
            }

            res.status(200).json({
                message: "Email found",
            })
        })
        .catch(err => {
            if (err.statusCode === 401) {
                res.status(200).json({
                    message: 'E-Mail not found'
                })
            } else {
                res.status(500).json({
                    message: "Internal Server Error",
                })
            }
        })
}

exports.login = (req, res, next) => {
    const email = req.body.email.toLowerCase();
    const password = req.body.password;
    let loadedUser = '';

    User
        .findOne({ email: email })
        .then(user => {
            if (!user) {
                const error = new Error("Email doesn't exist");
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error("Invalid Password");
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                email: loadedUser.email,
                userId: loadedUser._id.toString()
            },
                '4=?ADE56GJMC2%7&kF%HTqy8CfTZuj5e2aTKy2g!^F-W%7uP$cUqfuWcQxyVP*ez',
                { expiresIn: '1h' }
            );

            res.status(200).json({
                token: token,
                userId: loadedUser._id.toString(),
            })
        })
        .catch(err => {
            if (err.statusCode === 401) {
                res.status(200).json({
                    message: "Invalid Password",
                })
            } else {
                res.status(500).json({
                    message: "Internal Server Error",
                })
            }
        })
}