const express = require('express');
const router = express.Router();

const announcementsRouter = require('./announcements');

router.use('/announcements', announcementsRouter);

module.exports = router;