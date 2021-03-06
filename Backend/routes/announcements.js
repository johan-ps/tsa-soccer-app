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

router.post('/', announcementsController.getAllAnnouncementsByFilters)

router.post('/add', isAuth, uploads.single('image'), announcementsController.addAnnouncement)

router.put('/:id/update', isAuth, uploads.single('image'), announcementsController.updateById)

router.delete('/:id/delete', isAuth, announcementsController.deleteById)

router.get('/:id/teams', announcementsController.getTeamsFromAnnouncements)

router.get('/:id/downloadImage', announcementsController.downloadImage)

module.exports = router;
