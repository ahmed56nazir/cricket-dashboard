const express = require('express');
const dotenv = require('dotenv');

const {connectDB} = require('./config/db');

const app = express();
dotenv.config();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

connectDB(process.env.DB_URL);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`)
})