const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createToken = (_id) => {
  return jwt.sign({_id}, process.env.SECRET, { expiresIn: '1d' })
}

// login a user
const loginUser = async (req, res) => {
    const {email, password} = req.body
  
    try {
      const user = await User.login(email, password, false, null, null)
  
      // create a token
      const token = createToken(user._id)
  
      res.status(200).json({email, token})
    } catch (error) {
      res.status(400).json({error: error.message})
    }
  }

// signup a user
const signupUser = async (req, res) => {
  const {email, password} = req.body

  try {
    const user = await User.signup(email, password, false, null, null)

    // create a token
    const token = createToken(user._id)

    res.status(200).json({email, token})
  } catch (error) {
    res.status(400).json({error: error.message})
  }
}

// Google login a user
const googleLoginUser = async (req, res) => {
  try {
    const user = req.user
    
    const { email } = user

    // create a token
    const token = createToken(user._id)

    // check if accessToken exist for google
    res.status(200).json({email, token})

  } catch (error) {
    res.status(202).json({error: 'User Not yet logged in'})
  }
}

module.exports = { signupUser, loginUser, googleLoginUser }