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
    avatar: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new ErrorHandler(400, 'Avatar must be a valid URL');
        }
      },
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
    tweetLikes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  },
  { timestamps: true }
);

// Add paginate plugin
ProfileSchema.plugin(paginatePlugin);

ProfileSchema.methods.follow = function (userId) {
  const user = this;

  if (!user.following.includes(userId)) {
    user.following.push(userId);
  }

  return user.save();
};

ProfileSchema.methods.unfollow = function (userId) {
  const user = this;

  if (user.following.includes(userId)) {
    user.following.remove(userId);
  }

  return user.save();
};

ProfileSchema.methods.isFollowing = function (userId) {
  const user = this;
  return user.following.includes(userId);
};

ProfileSchema.methods.likeTweet = function (tweetId) {
  const user = this;

  if (!user.tweetLikes.includes(tweetId)) {
    user.tweetLikes.push(tweetId);
  }

  return user.save();
};

ProfileSchema.methods.unlikeTweet = function (tweetId) {
  const user = this;

  if (user.tweetLikes.includes(tweetId)) {
    user.tweetLikes.remove(tweetId);
  }

  return user.save();
};

ProfileSchema.methods.likesTweet = function (tweetId) {
  const user = this;
  return user.tweetLikes.includes(tweetId);
};

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
