const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { ErrorHandler } = require('../../utils/error');
const { generateAccessToken, hashPassword } = require('../../utils/auth');
const { paginatePlugin } = require('../../utils/mongo');
const { roles } = require('../../config/roles');
const { formatUsername } = require('../../utils/helpers');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!value.match(/^[0-9a-zA-Z_.-]+$/)) {
          throw new ErrorHandler(400, 'username must only contain numbers, letters, ".", "-", "_"');
        }
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new ErrorHandler(400, 'Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new ErrorHandler(400, 'Password must contain at least one letter and one number');
        }
      },
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    avatar: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new ErrorHandler(400, 'Avatar must be a valid URL');
        }
      },
    },
  },
  { timestamps: true }
);

// Add paginate plugin
UserSchema.plugin(paginatePlugin);

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
  if (user.isModified('username')) {
    user.username = formatUsername(user.username);
  }

  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

UserSchema.methods.generateAuthToken = function () {
  const user = this;
  const token = generateAccessToken(user.id);
  return token;
};

UserSchema.statics.findByCredentials = async function (username, password, isEmail) {
  const user = await this.findOne({
    [isEmail ? 'email' : 'username']: username,
  });
  if (!user) {
    throw new ErrorHandler(400, 'Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ErrorHandler(400, 'Invalid login credentials');
  }

  return user;
};

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({
    email: email.toLowerCase(),
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

UserSchema.statics.isUsernameTaken = async function (username, excludeUserId) {
  const user = await this.findOne({
    username: username.toLowerCase(),
    _id: { $ne: excludeUserId },
  });
  return !!user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
