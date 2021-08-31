const express = require('express');
const teamsController = require('../controllers/teams');
const { isAuth } = require('../middleware/auth');
const router = express.Router();

router.get('/', teamsController.getAllTeams)

router.get('/:id', teamsController.getTeamById)

router.get('/:id/users', teamsController.getAllUsersFromTeam)

router.post('/create', teamsController.createTeam)

router.put('/:id/update', isAuth, teamsController.updateById)

router.delete('/:id/delete', isAuth, teamsController.deleteById)

module.exports = router;
