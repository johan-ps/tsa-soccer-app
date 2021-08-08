const express = require('express');
const usersController = require('../controllers/users');
const { isAuth } = require('../middleware/auth');
const router = express.Router()
const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb('invalid image file', false);
    }
}

const uploads = multer({
    storage,
    fileFilter,
})

router.get('/', usersController.getAllUsers)

router.post('/login', usersController.loginUser)

router.post('/session', usersController.session);

router.post('/add', usersController.addUser)

router.put('/:id/update', isAuth, uploads.single('profileImg'), usersController.updateById)

router.delete('/:id/delete', usersController.deleteById)

module.exports = router;