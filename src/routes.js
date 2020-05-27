var express = require('express');
var router = express.Router();

const publicRoutes = ['/users'];

var userController = require('./controllers/userController');

// user routes
router.get('/users', userController.getUsers);
router.post('/users', userController.addUser);
router.get('/users/:id', userController.getUser);

module.exports = router;
module.exports.publicRoutes = publicRoutes;
