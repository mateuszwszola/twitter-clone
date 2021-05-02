const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { paginatePlugin } = require('../../utils/mongo');

const TweetSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    replyTo: {
      type: Schema.Types.ObjectId,
      ref: 'Tweet',
    },
    repliesCount: {
      type: Number,
      default: 0,
    },
    edited: {
      type: Boolean,
      default: false,
    },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    // retweetedBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    // },
    // likedBy: {
    //   type: Schema.Types.ObjectId,
    //   ref: 'User',
    // },
  },
  { timestamps: true }
);

// Add paginate plugin
TweetSchema.plugin(paginatePlugin);

TweetSchema.methods.updateRepliesCount = async function () {
  this.repliesCount = await mongoose.model('Tweet').countDocuments({ replyTo: this._id });
  return this.save();
};

TweetSchema.methods.like = function (userId) {
  if (!this.likes.some((id) => id.equals(userId))) {
    this.likes.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

TweetSchema.methods.unlike = function (userId) {
  if (this.likes.some((id) => id.equals(userId))) {
    this.likes.remove(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

TweetSchema.methods.retweet = function (userId) {
  if (!this.retweets.some((id) => id.equals(userId))) {
    this.retweets.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

TweetSchema.methods.unRetweet = function (userId) {
  if (this.retweets.some((id) => id.equals(userId))) {
    this.retweets.remove(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

const Tweet = mongoose.model('Tweet', TweetSchema);

module.exports = Tweet;
