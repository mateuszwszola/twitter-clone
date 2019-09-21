const router = require('express').Router();
const auth = require('../middleware/auth');
const commentController = require('../controllers/commentController');

/*
    @route GET api/comments/:tweet_id
    @desc Get all tweet comments
    @access Public
 */
router.get('/:tweet_id', commentController.getComments);

/*
  @route   POST api/comments/:tweet_id
  @desc    Add a comment to a tweet
  @access  Private
 */
router.post('/:tweet_id', auth, commentController.validate('createComment'), commentController.createComment);

/*
  @route   PUT api/comments/comment/:comment_id
  @desc    Update comment
  @access  Private
 */
router.put('/comment/:comment_id', auth, commentController.validate('updateComment'), commentController.updateComment);

/*
  @route   DELETE api/comments/comment/:comment_id
  @desc    Delete Comment
  @access  Private
 */
router.delete('/comment/:comment_id', auth, commentController.deleteComment);

module.exports = router;
