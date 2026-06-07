const express = require('express');
const router = express.Router();
const series = require('../controllers/series');

router.get('/series', series.getSeries);

module.exports = router;