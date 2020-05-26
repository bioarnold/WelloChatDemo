var express = require('express');
var router = express.Router();

const publicRoutes = ['/users'];

var userController = require('./controllers/userController');

// user routes
router.get('/users', userController.getUsers);

module.exports = router;
module.exports.publicRoutes = publicRoutes;
