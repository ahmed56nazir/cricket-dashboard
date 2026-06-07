const Team = require("../models/team")

async function getTeams(req, res) {
    try {
        const teams = await Team.find()
        res.render("teams", {teams})
    } catch (err) {
        res.json({error: err.message})
    }
}

module.exports = {getTeams}