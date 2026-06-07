const Series = require("../models/series")

async function getSeries(req, res) {
    try {
        const series = await Series.find()
        res.render("series", {series})
    } catch (err) {
        res.json({error: err.message})
    }
}

module.exports = {getSeries}