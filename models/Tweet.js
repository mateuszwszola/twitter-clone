const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TweetSchema = new Schema({
  // 1. Owner of that tweet (user_id)
  // 2. Date -> when added
  // 3. Tweet content:
  // a) text - required
  // b) media - optional, (image, video)
  // 4. Comments - comments are just another tweet, (array of tweet_ids)
  // So based on the length of the array I can tell how much comments that tweet have
  // 5. Likes -> array of user_ids who liked
  // 6. Retweets -> array of tweets_ids
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  created: {
    type: Date,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  media: {
    type: String // url to the photo/video
  },
  comments: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'tweets'
      }
    }
  ],
  likes: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      }
    }
  ],
  retweets: [
    {
      tweet: {
        type: Schema.Types.ObjectId,
        ref: 'tweets'
      }
    }
  ]
});

module.exports = Tweet = mongoose.model('tweets', TweetSchema);
