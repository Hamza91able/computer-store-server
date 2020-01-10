const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post("/get-user", isAuth, userController.getUser);
router.post("/save-information", isAuth, userController.saveUserInformation);
router.get('/get-user-delievery-information', isAuth, userController.getDelieveryAddress);

module.exports = router;