const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { ErrorHandler } = require('../../utils/error');
const { generateAccessToken, hashPassword } = require('../../utils/auth');
const { Profile } = require('../profiles');
const logger = require('../../utils/logger');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      validate: (value) => validator.isEmail(value),
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    try {
      const hashedPassword = await hashPassword(user.password, 10);
      user.password = hashedPassword;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

UserSchema.post('save', async function (user) {
  // Create empty user profile
  try {
    await Profile.create({ user: user._id });
  } catch (err) {
    logger.error({ err }, 'Error while creating empty user profile');
  }
});

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const payload = {
    user: {
      id: user.id,
      role: user.role,
    },
  };
  const token = generateAccessToken(payload);
  return token;
};

UserSchema.statics.findByCredentials = async function (
  username,
  password,
  isEmail
) {
  const user = await this.findOne({
    [isEmail ? 'email' : 'username']: username,
  });
  if (!user) {
    throw new ErrorHandler(422, 'Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ErrorHandler(422, 'Invalid login credentials');
  }

  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
