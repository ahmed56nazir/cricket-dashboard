const Player = require("../models/player")

async function getPlayerDetail(req, res) {
    try {
        const player = await Player.findOne({ playerId: req.params.id })
        if(player) {
            res.render("player", { player })
        } else {
            res.render("player", { player: null })
        }
    } catch(err) {
        res.json({ error: err.message })
    }
}

async function getSearch(req, res) {
    try {
        res.render("search")
    } catch(err) {
        res.json({ error: err.message })
    }
}

async function searchPlayer(req, res) {
    try {
        const query = req.body.query;

        const allPlayers = await Player.find();
        const players = allPlayers.filter(player => 
            player.name.toLowerCase().includes(query.toLowerCase())
        )

        res.render("search", {players, query})
    }
    catch (err) {
        res.json({error: err.message})
    }
}

module.exports = {getPlayerDetail, getSearch, searchPlayer}