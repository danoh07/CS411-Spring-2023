const express = require('express')
// controller functions
const { loginUser, signupUser, googleLoginUser } = require('../controllers/userController')
const {  logout } = require('../controllers/youtubeAPIController')
const { logOut } = require('../controllers/spotifyAPIController')

const router = express.Router()
const passport = require('passport');

// login route
router.post('/login', loginUser)

// signup route
router.post('/signup', signupUser)

// Auth Google
router.get("/auth/google/login/success", googleLoginUser);
  
router.get('/auth/google', passport.authenticate('google', { scope:[ 'email', 'profile', 'https://www.googleapis.com/auth/youtube', 'https://www.googleapis.com/auth/youtube.readonly'] }))

router.get('/auth/google/callback',
    passport.authenticate( 'google', {
        successRedirect: 'http://localhost:3000/',
        failureRedirect: '/auth/login/failed'
}));

router.get("/auth/login/failed", (req, res) => {
    res.status(400).json({error: 'Google Authentication Failed'})
});

router.get("/auth/google/logout", logout, logOut, async (req, res) => {
    req.logout();
    // todo clear / unset access token from the database 
    res.redirect('http://localhost:3000/login');
});

module.exports = router