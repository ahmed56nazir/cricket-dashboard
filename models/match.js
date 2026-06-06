const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    venue: {
        type: String
    },
    date: {
        type: String
    },
    teamA: {
        name: { type: String },
        score: { type: String },
        wickets: { type: String },
        overs: { type: String }
    },
    teamB: {
        name: { type: String },
        score: { type: String },
        wickets: { type: String },
        overs: { type: String }
    },
    result: {
        type: String
    },
    matchType: {
        type: String
    },
    seriesName: {
        type: String
    }
});

const match = mongoose.model('Match', matchSchema);
module.exports = match;