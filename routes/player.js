const express = require("express")
const router = express.Router()
const player = require('../controllers/player')
const { validateSearch } = require("../middleware/validator")

router.route("/players/:id")
    .get(player.getPlayerDetail)

router.route("/search")
    .get(player.getSearch)
    .post(validateSearch, player.searchPlayer)

module.exports = router