const express = require('express');
const router = express.Router();
const player = require('../controllers/player');

router.get('/players/:id', player.getPlayerDetail);
router.get('/search', player.getSearch);
router.post('/search', player.searchPlayer);

module.exports = router;