const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  accessToken:{
    type: String,
    required: false
  },
  refreshToken: {
    type: String, 
    required: false
  }
})

// static signup method
userSchema.statics.signup = async function(email, password, oauth, accessToken, refreshToken) {

  // if its using third party oauth 
  if (oauth) {

    const user = await this.create({ email, accessToken, refreshToken })
    return user

  } else {
    
    // validation
    if (!email || !password) {
      throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
      throw Error('Email not valid')
    }
    if (!validator.isStrongPassword(password)) {
      throw Error('Password not strong enough')
    }

    const exists = await this.findOne({ email })

    if (exists) {
      throw Error('Email already in use')
    }

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({ email, password: hash })

    return user
  }
}

// static login method
userSchema.statics.login = async function(email, password, oauth, accessToken, refreshToken) {
  // if its using third party oauth 
  if (oauth) {

    const user = await this.findOne({ email })
    if (!user) {
      console.log('Creating new user')
      const user = await this.signup(email, null, true, accessToken, refreshToken)
      return user
    }

    const user2 = await this.findOneAndUpdate({ email }, {accessToken, refreshToken})

    return user

  } else {
    // validation
    if (!email || !password) {
      throw Error('All fields must be filled')
    }
    if (!validator.isEmail(email)) {
        throw Error('Email not valid')
    }
    if (!validator.isStrongPassword(password)) {
    throw Error('Password not strong enough')
    }
  
    const user = await this.findOne({ email })
    if (!user) {
      throw Error('Incorrect email')
    }
  
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      throw Error('Incorrect password')
    }
  
    return user
  }
}

module.exports = mongoose.model('User', userSchema)