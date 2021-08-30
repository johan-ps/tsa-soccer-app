const express = require('express');
const eventsController = require('../controllers/events');
const { isAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', eventsController.getAllEvents)

router.get('/:id/details', eventsController.getEventById)

router.get('/teams', eventsController.getEventsByTeam)

router.get('/startingFrom', eventsController.getEventsFromDate)

router.get('/date', eventsController.getEventsOnDate)

router.post('/create', isAuth, eventsController.createEvent)

router.put('/:id/update', isAuth, eventsController.updateById)

router.delete('/:id/delete', isAuth, eventsController.deleteById)

module.exports = router;
