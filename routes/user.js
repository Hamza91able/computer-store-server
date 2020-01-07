const express = require('express');

const userController = require('../controllers/user');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.post("/get-user", isAuth, userController.getUser);;

module.exports = router;