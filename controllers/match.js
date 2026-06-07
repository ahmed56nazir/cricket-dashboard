const Match = require("../models/match")

async function getScoreboard(req, res) {
    try {
        const matches = await Match.find()
        res.render("scoreboard", {matches})
    } catch (err) {
        res.json({error: err.message})
    }
}

module.exports = {getScoreboard}