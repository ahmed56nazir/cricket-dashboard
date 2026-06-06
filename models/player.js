const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
    playerId: {
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
    role: {
        type: String
    },
    battingStyle: {
        type: String
    },
    bowlingStyle: {
        type: String
    },
    dateOfBirth: {
        type: String
    },
    image: {
        type: String
    },
    teamName: {
        type: String
    },
    description: {
        type: String
    }
});

const player = mongoose.model('Player', playerSchema);
module.exports = player;