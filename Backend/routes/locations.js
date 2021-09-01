const express = require('express');
const locationsController = require('../controllers/locations');
const { isAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', locationsController.getAllLocations)

router.get('/:id', locationsController.getLocationById)

router.post('/create', isAuth, locationsController.createLocation)

router.put('/:id/update', isAuth, locationsController.updateById)

router.delete('/:id/delete', isAuth, locationsController.deleteById)

module.exports = router;
