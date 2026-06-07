const mongoose = require("mongoose")
const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()

const Match = require("./models/match")
const Series = require("./models/series")
const Player = require("./models/player")
const Team = require("./models/team")

const API_KEY = process.env.CRICKET_API_KEY

// ICC T20 WORLD CUP 2024 FINAL SQUADS
const indiaSquad = [
    "Rohit Sharma", "Virat Kohli", "Rishabh Pant",
    "Suryakumar Yadav", "Hardik Pandya", "Jasprit Bumrah",
    "Ravindra Jadeja", "Shivam Dube", "Axar Patel",
    "Arshdeep Singh", "Yuzvendra Chahal", "Kuldeep Yadav",
    "KL Rahul", "Sanju Samson", "Mohammed Siraj"
]

const southAfricaSquad = [
    "Temba Bavuma", "Quinton de Kock", "Reeza Hendricks",
    "Aiden Markram", "David Miller", "Heinrich Klaasen",
    "Marco Jansen", "Keshav Maharaj", "Anrich Nortje",
    "Kagiso Rabada", "Tabraiz Shamsi", "Tristan Stubbs",
    "Ryan Rickelton", "Ottneil Baartman", "Bjorn Fortuin"
]

async function fetchPlayerData(name, teamName) {
    try {
        const searchResponse = await axios.get(
            `https://api.cricapi.com/v1/players?apikey=${API_KEY}&offset=0&search=${name}`
        )

        const searchResults = searchResponse.data.data
        if(!searchResults || searchResults.length === 0) {
            console.log(`Player not found: ${name}`)
            return null
        }

        const playerId = searchResults[0].id

        const infoResponse = await axios.get(
            `https://api.cricapi.com/v1/players_info?apikey=${API_KEY}&id=${playerId}`
        )

        const playerData = infoResponse.data.data
        if(!playerData) {
            console.log(`Player info not found: ${name}`)
            return null
        }

        return {
            playerId: playerData.id,
            name: playerData.name,
            country: playerData.country || "",
            role: playerData.role || "",
            battingStyle: playerData.battingStyle || "",
            bowlingStyle: playerData.bowlingStyle || "",
            dateOfBirth: playerData.dateOfBirth || "",
            placeOfBirth: playerData.placeOfBirth || "",
            image: playerData.playerImg || "",
            teamName: teamName,
            stats: playerData.stats || []
        }

    }
    catch(err) {
        console.log(`Error fetching player ${name}:`, err.message)
        return null
    }
}

async function fetchMatches() {
    try {
        const response = await axios.get(
            `https://api.cricapi.com/v1/matches?apikey=${API_KEY}&offset=0`
        )

        const matchesData = response.data.data
        if(!matchesData) {
            console.log("No match data received from API")
            return
        }

        await Match.deleteMany()
        console.log("Existing matches cleared..")

        const matches = matchesData.map(match => ({
            matchId: match.id,
            title: match.name,
            matchType: match.matchType,
            status: match.status,
            venue: match.venue,
            date: match.date,
            teamA: {
                name: match.teams[0] || "",
                score: "",
                wickets: "",
                overs: ""
            },
            teamB: {
                name: match.teams[1] || "",
                score: "",
                wickets: "",
                overs: ""
            },
            result: match.status,
            seriesName: match.series_id
        }))

        await Match.insertMany(matches)
        console.log(`${matches.length} matches inserted successfully..`)

    }
    catch(err) {
        console.log("Error fetching matches:", err.message)
    }
}

async function fetchSeries() {
    try {
        const response = await axios.get(
            `https://api.cricapi.com/v1/series?apikey=${API_KEY}&offset=0`
        )

        const seriesData = response.data.data
        if(!seriesData) {
            console.log("No series data received from API")
            return
        }

        await Series.deleteMany()
        console.log("Existing series cleared..")

        const series = seriesData.map(s => ({
            seriesId: s.id,
            name: s.name,
            startDate: s.startDate,
            endDate: s.endDate,
            totalMatches: s.matches,
            matchType: `ODI: ${s.odi} | T20: ${s.t20} | Test: ${s.test}`,
            status: "Upcoming"
        }))

        await Series.insertMany(series)
        console.log(`${series.length} series inserted successfully..`)

    } catch(err) {
        console.log("Error fetching series:", err.message)
    }
}

async function fetchPlayers() {
    try {
        await Player.deleteMany()
        console.log("Existing players cleared..")

        console.log("Fetching India squad...")
        for(const name of indiaSquad) {
            const player = await fetchPlayerData(name, "India")
            if(player) {
                await Player.create(player)
                console.log(`Inserted: ${player.name}`)
            }
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        console.log("Fetching South Africa squad...")
        for(const name of southAfricaSquad) {
            const player = await fetchPlayerData(name, "South Africa")
            if(player) {
                await Player.create(player)
                console.log(`Inserted: ${player.name}`)
            }
            // Small delay to avoid hitting API rate limit
            await new Promise(resolve => setTimeout(resolve, 1000))
        }

        console.log("All players inserted successfully..")

    } catch(err) {
        console.log("Error fetching players:", err.message)
    }
}

async function fetchTeams() {
    try {
        await Team.deleteMany()
        console.log("Existing teams cleared..")

        const teams = [
            {
                teamId: "india-t20-2024",
                name: "India",
                country: "India",
                captain: "Rohit Sharma",
                coach: "Rahul Dravid",
                image: "https://g.cricapi.com/iapi/32-637877061328728555.webp?w=48",
                players: indiaSquad.map(name => ({ name, role: "" }))
            },
            {
                teamId: "southafrica-t20-2024",
                name: "South Africa",
                country: "South Africa",
                captain: "Aiden Markram",
                coach: "Rob Walter",
                image: "https://g.cricapi.com/iapi/76-637877075788553703.webp?w=48",
                players: southAfricaSquad.map(name => ({ name, role: "" }))
            }
        ]

        await Team.insertMany(teams)
        console.log("Teams inserted successfully..")

    } catch(err) {
        console.log("Error fetching teams:", err.message)
    }
}

async function fetchAll() {
    try {
        await mongoose.connect(process.env.DB_URL)
        console.log("MongoDB Connected..")

        await fetchMatches()
        await fetchSeries()
        await fetchTeams()
        await fetchPlayers()

        console.log("All data fetched successfully!")
        process.exit(0)

    } catch(err) {
        console.log("Error:", err.message)
        process.exit(1)
    }
}

fetchAll();