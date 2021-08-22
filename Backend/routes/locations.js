const express = require('express');
const locationsController = require('../controllers/locations');
const { isAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', eventsController.getAllLocations)

router.get('/:id', eventsController.getLocationById)

router.get('/create', eventsController.createLocation)

router.put('/:id/update', isAuth, eventsController.updateById)

router.delete('/:id/delete', isAuth, eventsController.deleteById)

module.exports = router;
