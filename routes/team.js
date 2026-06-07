const express = require('express');
const router = express.Router();
const team = require('../controllers/team');

router.get('/teams', team.getTeams);

module.exports = router;