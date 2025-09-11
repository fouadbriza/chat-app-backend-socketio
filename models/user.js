const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  username: {
    type: String,
    unique: true,
    sparse: true,
    lowercase: true,
    trim: true
  },

  password: {
    type: String,
    select: false 
  },

  googleId: {
    type: String,
    unique: true,
    sparse: true 
  },

  name: {
    type: String,
    trim: true
  },

  avatar: {
    type: String
  },

  provider: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  isVerified: {
    type: Boolean,
    default: false
  },

  refreshTokens: [String]
});


//Password hashing
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10); 
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err); 
  }
});

//compare password methode
userSchema.methods.comparePassword = async function (password) {

  if (!password) return false;
  try {
    return await bcrypt.compare( password , this.password );
  } catch(err) {
    console.error('Error in comparePassword method ' , err );
    return false;
  }

}

module.exports = mongoose.model('User' , userSchema);