const express = require('express');
const router = express.Router();

const announcementsRouter = require('./announcements');
const usersRouter = require('./users');
const eventsRouter = require('./events');

router.use('/announcements', announcementsRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);

module.exports = router;
