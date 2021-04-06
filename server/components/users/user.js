const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    validate: (value) => {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    required: true,
  },
  // User avatar - uploaded by user
  avatar: {
    type: String,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
