const express = require('express');
const announcementsController = require('../controllers/announcements');
const router = express.Router()

router.get('/', announcementsController.getAllAnnouncements)

router.get('/teams', announcementsController.getAnnouncementsByTeam)

router.post('/add', announcementsController.addAnnouncement)

router.put('/:id/update', announcementsController.updateById)

router.delete('/:id/delete', announcementsController.deleteById)

module.exports = router;
