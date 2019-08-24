const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const validator = require('validator');

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  bio: {
    type: String
  },
  location: {
    type: String
  },
  website: {
    type: String
  },
  birthday: {
    type: Date
  },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  // Tweets that will be displayed on the logged in user homepage
  homepageTweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  backgroundPicture: {
    type: String,
    validate: value => {
      return validator.isURL(value)
    }
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('Profile', ProfileSchema);
