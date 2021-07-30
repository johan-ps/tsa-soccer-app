const express = require('express');
const announcementsController = require('../controllers/announcements');
const router = express.Router()

router.get('/', announcementsController.getAllAnnouncements)

module.exports = router;
