const mongoose = require('mongoose');

const seriesSchema = new mongoose.Schema({
    seriesId: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: String
    },
    endDate: {
        type: String
    },
    status: {
        type: String
    },
    matchType: {
        type: String
    },
    totalMatches: {
        type: Number
    },
    country: {
        type: String
    }
});

const series = mongoose.model('Series', seriesSchema);
module.exports = series;