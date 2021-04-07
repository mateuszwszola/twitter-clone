const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema(
  {
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
    backgroundPicture: {
      type: String,
    },
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    likes: [{ type: Schema.Types.ObjectId, ref: 'Tweet' }],
  },
  { timestamps: true }
);

ProfileSchema.methods.follow = function (userId) {
  const user = this;

  if (!user.following.includes(userId)) {
    user.following.push(userId);
    return user.save();
  }

  return user;
};

ProfileSchema.methods.unfollow = function (userId) {
  const user = this;

  if (user.following.includes(userId)) {
    user.following.remove(userId);
    return user.save();
  }

  return user;
};

ProfileSchema.methods.isFollowing = function (userId) {
  const user = this;
  return user.following.includes(userId);
};

const Profile = mongoose.model('Profile', ProfileSchema);

module.exports = Profile;
