require('dotenv').config();
const passport = require('passport');
const User = require('../models/userModel');

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const strategy = new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:8888/api/user/auth/google/callback",
  passReqToCallback   : true
},

async (request, accessToken, refreshToken, profile, done) => {
  try {
    // try to see if user exist in DB and login if they do
    const user = await User.login(profile.email, null, true)
    request.user = user
    return done(null, user)
  // if user doesn't exist in the db then create new user and store them in DB
  } catch (error) {
    return done(error, false)
  }
})

passport.use(strategy);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});