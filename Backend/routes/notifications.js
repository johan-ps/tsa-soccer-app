const express = require('express');
const notificationController = require('../controllers/notifications');
const { isAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/:userId', isAuth, notificationController.getNotificationPreferences)

router.post('/:userId', isAuth, notificationController.updateNotifications)

module.exports = router;
