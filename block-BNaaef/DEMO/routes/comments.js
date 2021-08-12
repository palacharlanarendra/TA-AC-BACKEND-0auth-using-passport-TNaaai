var express = require('express');
var router = express.Router();
var Comments = require('../models/comments');
var Blog = require('../models/blogs');
const isLoggedIn = require('../middleware/auth');
router.get('/:id/edit', isLoggedIn, function (req, res, next) {
  var id = req.params.id;
  Comments.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render('editComments', { comment: comment });
  });
});

router.post('/:id', isLoggedIn, (req, res, next) => {
  var id = req.params.id;
  Comments.findByIdAndUpdate(id, req.body, (err, updatedComments) => {
    if (err) return next(err);
    res.redirect('/articles/' + updatedComments.articleId);
  });
});
router.get('/:id/delete', isLoggedIn, function (req, res, next) {
  var id = req.params.id;
  Comments.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: comment._id } },
      (err, blog) => {
        res.redirect('/articles/' + comment.articleId);
      }
    );
  });
});
module.exports = router;
