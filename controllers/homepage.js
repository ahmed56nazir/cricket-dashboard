const Match = require("../models/match")

async function getHomepage(req, res) {
    try {
        const matches = await Match.find()
        res.render("homepage", {matches})
    } catch (err) {
        res.json({ error: err.message })
    }
}

module.exports = {getHomepage}