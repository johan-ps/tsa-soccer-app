const express = require('express');
const usersController = require('../controllers/users');
const router = express.Router()

router.get('/', usersController.getAllUsers)

router.get('/login', usersController.loginUser)

router.post('/add', usersController.addUser)

router.put('/:id/update', usersController.updateById)

router.delete('/:id/delete', usersController.deleteById)

module.exports = router;