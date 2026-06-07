const express = require('express');
const router = express.Router();
const match = require('../controllers/match');

router.get('/scoreboard', match.getScoreboard);

module.exports = router;