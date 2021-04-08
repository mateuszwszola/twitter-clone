const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { ErrorHandler } = require('../../utils/error');
const { generateAccessToken, hashPassword } = require('../../utils/auth');
const { paginatePlugin } = require('../../utils/mongo');
const { roles } = require('../../config/roles');

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
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate: (value) => {
        if (!validator.isEmail(value)) {
          throw new ErrorHandler('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
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
  next();
});

UserSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

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
    throw new ErrorHandler(401, 'Invalid login credentials');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ErrorHandler(401, 'Invalid login credentials');
  }

  return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
