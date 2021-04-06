const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  bio: {
    type: String,
  },
  location: {
    type: String,
  },
  website: {
    type: String,
  },
  birthday: {
    type: Date,
  },
  avatar: {
    type: String,
  },
  following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  tweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  // Tweets that will be displayed on the logged in user homepage
  homepageTweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  backgroundPicture: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
