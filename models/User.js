const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  // User avatar - uploaded by user
  avatar: {
    type: String
  },
  verified: {
    type: Boolean
  }
});

module.exports = User = mongoose.model('users', UserSchema);
