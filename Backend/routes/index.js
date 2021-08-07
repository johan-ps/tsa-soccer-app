const express = require('express');
const router = express.Router();

const announcementsRouter = require('./announcements');
const usersRouter = require('./users');

router.use('/announcements', announcementsRouter);
router.use('/users', usersRouter);

module.exports = router;
