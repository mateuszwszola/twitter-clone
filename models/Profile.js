const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
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
        ref: 'profiles'
      }
    }
  ],
  followers: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'profiles'
      }
    }
  ],
  likes: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'tweets'
      }
    }
  ],
  // Tweets that will be displayed on the user wall
  tweets: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'tweets'
      }
    }
  ],
  // User avatar - uploaded by user
  avatar: {
    type: String
  },
  // User background picture - uploaded by user
  backgroundPicture: {
    type: String
  }
});

module.exports = Profile = mongoose.model('profiles', ProfileSchema);
