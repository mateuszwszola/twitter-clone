const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  media: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'TweetComment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  // retweets are ids of people who retweeted
  retweets: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  retweeted: {
    type: Boolean,
    default: false
  },
  editted: {
    type: Boolean,
    default: false
  }
});

module.exports = Tweet = mongoose.model('Tweet', TweetSchema);
