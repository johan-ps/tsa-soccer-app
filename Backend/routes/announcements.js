const express = require('express');
const announcementsController = require('../controllers/announcements');
const { isAuth } = require('../middleware/auth');
const router = express.Router();
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

router.get('/', announcementsController.getAllAnnouncements)

router.get('/teams', announcementsController.getAnnouncementsByTeam)

router.post('/add', isAuth, uploads.single('image'), announcementsController.addAnnouncement)

router.put('/:id/update', announcementsController.updateById)

router.delete('/:id/delete', announcementsController.deleteById)

module.exports = router;
