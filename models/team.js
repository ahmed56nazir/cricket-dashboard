const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    country: {
        type: String
    },
    captain: {
        type: String
    },
    coach: {
        type: String
    },
    image: {
        type: String
    },
    players: [
        {
            playerId: { type: String },
            name: { type: String },
            role: { type: String }
        }
    ]
});

const team = mongoose.model('Team', teamSchema);
module.exports = team;