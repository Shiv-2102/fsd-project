require('dotenv').config();
const connectToMongo = require('./db');
connectToMongo();

const express = require('express')
var cors = require('cors')
const app = express()
const port = 5000

app.use(cors())
app.use(express.json());

// Routes 
app.use('/api/auth', require('./routes/auth.js'));
app.use('/api/notes', require('./routes/notes.js'));


// Listening on Port
app.listen(port, () => {
    console.log(`Cloudbook Backend Running on Port ${port}`)
})
