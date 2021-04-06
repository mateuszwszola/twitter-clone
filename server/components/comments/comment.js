const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  tweet: {
    type: Schema.Types.ObjectId,
    ref: 'Tweet',
  },
  text: {
    type: String,
    required: true,
  },
  media: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

const Comment = mongoose.model('Comment', CommentSchema);

module.exports = Comment;
