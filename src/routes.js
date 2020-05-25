var express = require('express');
var router = express.Router();

var userController = require('./controllers/userController');

// user routes
router.get('/users/', userController.getUsers);

module.exports = router;
