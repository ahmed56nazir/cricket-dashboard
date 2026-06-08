const mongoose = require("mongoose")
const dotenv = require("dotenv")
const axios = require("axios")

dotenv.config()

const Match = require("./models/Match")
const Series = require("./models/Series")
const Player = require("./models/Player")
const Team = require("./models/Team")

const CRICKET_API_KEY = process.env.CRICKET_API_KEY
const ENTITY_SPORT_API = "ec471071441bb2ac538a0ff901abd249"

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

async function fetchMatches() {
    try {
        // Fetch completed matches
        const completedResponse = await axios.get(
            `https://rest.entitysport.com/v2/matches/?token=${ENTITY_SPORT_API}&status=2&per_page=20`
        )

        // Fetch upcoming matches
        const upcomingResponse = await axios.get(
            `https://rest.entitysport.com/v2/matches/?token=${ENTITY_SPORT_API}&status=1&per_page=10`
        )

        const completedMatches = completedResponse.data.response.items || []
        const upcomingMatches = upcomingResponse.data.response.items || []

        // Combine both
        const allMatches = [...completedMatches, ...upcomingMatches]

        if(allMatches.length === 0) {
            console.log("No match data received from Entity Sport")
            return
        }

        await Match.deleteMany()
        console.log("Existing matches cleared..")

        const filteredMatches = allMatches.filter(match => {
            if(match.domestic === "1") return false
            if(!match.title) return false
            if(match.title.includes("Women")) return false
            if(match.title.includes("U19")) return false
            if(match.title.includes(" A ")) return false
            return true
        })

        const matches = filteredMatches.map(match => ({
            matchId: String(match.match_id),
            title: match.title || "N/A",
            matchType: match.format_str || "N/A",
            status: match.status_str || "Upcoming",
            venue: match.venue ? match.venue.name : "TBC",
            date: match.date_start ? match.date_start.split(" ")[0] : "TBC",
            teamA: {
                name: match.teama ? match.teama.name : "",
                score: match.teama ? match.teama.scores : "",
                wickets: "",
                overs: match.teama ? match.teama.overs : ""
            },
            teamB: {
                name: match.teamb ? match.teamb.name : "",
                score: match.teamb ? match.teamb.scores : "",
                wickets: "",
                overs: match.teamb ? match.teamb.overs : ""
            },
            result: match.result || match.status_note || "",
            seriesName: match.competition ? match.competition.title : ""
        }))

        await Match.insertMany(matches)
        console.log(`${matches.length} matches inserted successfully..`)

    } catch(err) {
        console.log("Error fetching matches:", err.message)
    }
}

async function fetchSeries() {
    try {
        const response = await axios.get(
            `https://rest.entitysport.com/v2/competitions/?token=${ENTITY_SPORT_API}&per_page=25`
        )

        const seriesData = response.data.response.items || []

        if(seriesData.length === 0) {
            console.log("No series data received from Entity Sport")
            return
        }

        await Series.deleteMany()
        console.log("Existing series cleared..")

        const filteredSeries = seriesData.filter(s => {
            if(!s.title) return false
            if(s.title.includes("Women")) return false
            if(s.title.includes("U19")) return false
            if(s.title.includes(" A ")) return false
            if(s.category !== "international") return false
            return true
        })

        const series = filteredSeries.map(s => ({
            seriesId: String(s.cid),
            name: s.title,
            startDate: s.datestart || "TBC",
            endDate: s.dateend || "TBC",
            totalMatches: parseInt(s.total_matches) || 0,
            matchType: s.game_format || "mixed",
            status: s.status || "upcoming"
        }))

        await Series.insertMany(series)
        console.log(`${series.length} series inserted successfully..`)

    } catch(err) {
        console.log("Error fetching series:", err.message)
    }
}

async function fetchPlayerData(name, teamName) {
    try {
        const searchResponse = await axios.get(
            `https://api.cricapi.com/v1/players?apikey=${CRICKET_API_KEY}&offset=0&search=${name}`
        )

        const searchResults = searchResponse.data.data
        if(!searchResults || searchResults.length === 0) {
            console.log(`Player not found: ${name}`)
            return null
        }

        const playerId = searchResults[0].id

        const infoResponse = await axios.get(
            `https://api.cricapi.com/v1/players_info?apikey=${CRICKET_API_KEY}&id=${playerId}`
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

    } catch(err) {
        console.log(`Error fetching player ${name}:`, err.message)
        return null
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
        await mongoose.connect(process.env.MONGO_URI)
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