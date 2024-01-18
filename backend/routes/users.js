const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');


router.post('/register', usersController.register);


router.post('/login', usersController.login);


router.get('/', usersController.getAllUsers);



router.get('/:userId', usersController.getUserById);


router.put('/:userId', usersController.updateUser);


router.delete('/:userId', usersController.deleteUser);

module.exports = router;
