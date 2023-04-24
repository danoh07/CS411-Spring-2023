require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const playlistRoutes = require('./routes/playlists');
const userRoutes = require('./routes/user');
const passport = require('passport');
const cookieSession = require('cookie-session');
require('./config/passport');

// express app
const app = express()

// middleware
app.use(express.json())
app.use((req, res, next) => {
    console.log(req.path, req.method)
    next()
})

app.use(cookieSession({
    name: "Session",
    keys: [process.env.KEY],
    maxAge: 24 * 60 * 60 * 100,
}))



// routes
app.use('/api/playlists', playlistRoutes)


app.use(passport.initialize())
app.use(passport.session());
app.use('/api/user', userRoutes)

//connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        // listen for requests
        app.listen(process.env.PORT, () =>{
        console.log(`connected to db & listening on port ${process.env.PORT}, http://localhost:${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log(error)
    })

