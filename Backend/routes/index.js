const express = require('express');
const router = express.Router();

const announcementsRouter = require('./announcements');
const usersRouter = require('./users');
const eventsRouter = require('./events');
const locationsRouter = require('./locations');
const teamsRouter = require('./teams');
const notificationRouter = require('./notifications');

router.use('/announcements', announcementsRouter);
router.use('/users', usersRouter);
router.use('/events', eventsRouter);
router.use('/locations', locationsRouter);
router.use('/teams', teamsRouter);
router.use('/notification-preferences', notificationRouter);

module.exports = router;
