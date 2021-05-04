const mongoose = require('mongoose');
const validator = require('validator');
const { ErrorHandler } = require('../../utils/error');
const { paginatePlugin } = require('../../utils/mongo');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    bio: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new ErrorHandler(400, 'Website must be a valid URL');
        }
      },
    },
    birthday: {
      type: Date,
    },
    backgroundImage: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new ErrorHandler(400, 'Background image must be a valid URL');
        }
      },
    },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
    retweets: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  },
  { timestamps: true }
);

// Add paginate plugin
ProfileSchema.plugin(paginatePlugin);

ProfileSchema.methods.follow = function (userId) {
  if (!this.following.some((id) => id.equals(userId))) {
    this.following.push(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

ProfileSchema.methods.unfollow = function (userId) {
  if (this.following.some((id) => id.equals(userId))) {
    this.following.remove(userId);
    return this.save();
  }
  return Promise.resolve(this);
};

ProfileSchema.methods.isFollowing = function (userId) {
  return this.following.some((id) => id.equals(userId));
};

ProfileSchema.methods.like = function (tweetId) {
  if (!this.likes.some((id) => id.equals(tweetId))) {
    this.likes.push(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

ProfileSchema.methods.unlike = function (tweetId) {
  if (this.likes.some((id) => id.equals(tweetId))) {
    this.likes.remove(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

ProfileSchema.methods.likesIt = function (tweetId) {
  return this.likes.some((id) => id.equals(tweetId));
};

ProfileSchema.methods.retweet = function (tweetId) {
  if (!this.retweets.some((id) => id.equals(tweetId))) {
    this.retweets.push(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

ProfileSchema.methods.unRetweet = function (tweetId) {
  if (this.retweets.some((id) => id.equals(tweetId))) {
    this.retweets.remove(tweetId);
    return this.save();
  }
  return Promise.resolve(this);
};

ProfileSchema.methods.retweeted = function (tweetId) {
  return this.retweets.some((id) => id.equals(tweetId));
};

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
