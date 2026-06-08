const express = require('express');
const dotenv = require('dotenv');

const logger = require("./middlewares/logger")

const {connectDB} = require('./config/db');

const app = express();
dotenv.config();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

connectDB(process.env.DB_URL);


const homepageRoutes = require('./routes/homepage');
const teamRoutes = require('./routes/team');
const playerRoutes = require('./routes/player');
const matchRoutes = require('./routes/match');
const seriesRoutes = require('./routes/series');

app.use('/', homepageRoutes);
app.use('/', teamRoutes);
app.use('/', playerRoutes);
app.use('/', matchRoutes);
app.use('/', seriesRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})