function validateSearch(req, res, next) {
    const query = req.body.query

    if(!query || query.trim() === "") {
        return res.render("search", {
            error: "Please enter a player name to search",
            players: [],
            query: ""
        })
    }

    if(query.trim().length < 2) {
        return res.render("search", {
            error: "Please enter at least 2 characters",
            players: [],
            query: query
        })
    }

    next()
}

module.exports = { validateSearch }