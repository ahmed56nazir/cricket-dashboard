const Team = require("../models/team")
const Player = require("../models/player")

async function getTeams(req, res) {
    try {
        const teams = await Team.find()
        const players = await Player.find()

        const teamsWithPlayerIds = teams.map(team => {
            const updatedPlayers = team.players.map(teamPlayer => {
                const found = players.find(p =>
                    p.name.toLowerCase() === teamPlayer.name.toLowerCase()
                )
                return {
                    name: teamPlayer.name,
                    role: teamPlayer.role,
                    playerId: found ? found.playerId : null
                }
            })
            return {
                ...team.toObject(),
                players: updatedPlayers
            }
        })

        if(teamsWithPlayerIds) {
            res.render("teams", { teams: teamsWithPlayerIds })
        } else {
            res.end("Error getting teams..")
        }
    } catch(err) {
        res.json({ error: err.message })
    }
}

module.exports = {
    getTeams
}