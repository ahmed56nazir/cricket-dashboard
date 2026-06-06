const mongoose = require("mongoose")

async function connectDB(DB_URL) {
    try {
        await mongoose.connect(DB_URL)
        console.log("Connection Established Successfully...")
    }
    catch (error) {
        console.log("Database Connection Failed:")
        console.log(error.message)
    }
}

module.exports = {connectDB}