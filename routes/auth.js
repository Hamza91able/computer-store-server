const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage("Please enter a valid email address.")
            .custom((value, { req }) => {
                return User.findOne({ email: value }).then(user => {
                    if (user) {
                        return Promise.reject('E-Mail Address already exists.');
                    }
                })
            })
            .normalizeEmail(),
        body('password')
            .trim()
            .isLength({ min: 6 }),
        body('name')
            .trim()
            .not()
            .isEmpty()
    ],
    authController.signup
);

router.post('/check-email', authController.checkEmail);
router.post("/login", authController.login);

module.exports = router;