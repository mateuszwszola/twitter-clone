const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  following: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      }
    }
  ],
  likes: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
      }
    }
  ],
  tweets: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
      }
    }
  ],
  // Tweets that will be displayed on the logged in user homepage
  homepageTweets: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
      }
    }
  ],
  // User background picture - uploaded by user
  backgroundPicture: {
    type: String
  },
  created: {
    type: Date,
    default: Date.now
  }
});

module.exports = Profile = mongoose.model('Profile', ProfileSchema);
