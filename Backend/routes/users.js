const express = require('express');
const usersController = require('../controllers/users');
const { isAuth } = require('../middleware/auth');
const router = express.Router()

router.get('/', usersController.getAllUsers)

router.post('/login', usersController.loginUser)

router.post('/session', usersController.session);

router.post('/add', usersController.addUser)

router.put('/:id/update', usersController.updateById)

router.delete('/:id/delete', usersController.deleteById)

module.exports = router;