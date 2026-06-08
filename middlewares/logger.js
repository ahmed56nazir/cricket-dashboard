function logger(req, res, next) {
    const date = new Date().toLocaleString()
    console.log(`[${date}] ${req.method} request made to ${req.url}`)
    next()
}

module.exports = logger