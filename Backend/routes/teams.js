const express = require('express');
const teamsController = require('../controllers/teams');
const { isAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', eventsController.getAllTeams)

router.get('/:id', eventsController.getTeamById)

router.get('/create', eventsController.createTeam)

router.put('/:id/update', isAuth, eventsController.updateById)

router.delete('/:id/delete', isAuth, eventsController.deleteById)

module.exports = router;
