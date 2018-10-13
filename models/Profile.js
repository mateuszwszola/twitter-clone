const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  // User avatar - uploaded by user
  avatar: {
    type: String
  },
  // User background picture - uploaded by user
  backgroundPicture: {
    type: String
  }
});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
