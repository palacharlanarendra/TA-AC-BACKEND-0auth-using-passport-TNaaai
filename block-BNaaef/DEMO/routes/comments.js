var express = require('express');
var router = express.Router();
var Comments = require('../models/comments');
var Blog = require('../models/blogs');
router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Comments.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render('editComments', { comment: comment });
  });
});

router.post('/:id', (req, res, next) => {
  var id = req.params.id;
  Comments.findByIdAndUpdate(id, req.body, (err, updatedComments) => {
    if (err) return next(err);
    res.redirect('/articles/' + updatedComments.articleId);
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Comments.findByIdAndDelete(id, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(comment.bookId,{$pull:{comments:comment._id}},(err,blog)=>{
        res.redirect('/articles/' + comment.articleId);
    })
  });
});
module.exports = router;
