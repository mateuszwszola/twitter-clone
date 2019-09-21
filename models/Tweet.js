const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  // 1. Owner of that tweet (user_id)
  // 2. Date -> when added
  // 3. Tweet content:
  // a) text - required
  // b) media - optional, (image, video)
  // 4. CommentsList - comments are just another tweet, (array of tweet_ids)
  // So based on the length of the array I can tell how much comments that tweet have
  // 5. Likes -> array of user_ids who liked
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  text: {
    type: String,
    required: true
  },
  media: {
    type: String, // url to the photo/video
  },
  created: {
    type: Date,
    default: Date.now
  },
  comments: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
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
