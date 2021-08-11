var express = require('express');
var router = express.Router();
var Blog = require('../models/blogs');
var Comments = require('../models/comments');
/* GET users listing. */
router.get('/new', function (req, res, next) {
  res.render('addArticle');
});
router.get('/', function (req, res, next) {
  Blog.find({}, (err, articles) => {
    res.render('articles', { articles: articles });
  });
});
// router.get('/:id', function (req, res, next) {
//   var id = req.params.id;
//   Blog.findById(id, (err, articles) => {
//     if (err) return next(err);
//     Comments.find({ articleId: id }, (err, comment) => {
//       if (err) return next(err);
//       res.render('singleArticle', { articles: articles, comment: comment });
//     });
//   });
// });

router.get('/:id', function (req, res, next) {
  var id = req.params.id;
  Blog.findById(id)
    .populate('comments')
    .exec((err, articles) => {
      console.log(err, articles);
      res.render('singleArticle', { articles: articles });
    });
});

router.get('/:id/edit', function (req, res, next) {
  var id = req.params.id;
  Blog.findById(id, (err, articles) => {
    if (err) return next(err);
    res.render('editArticle', { articles: articles });
  });
});
router.post('/', function (req, res, next) {
  Blog.create(req.body, (err, createArticle) => {
    console.log(err, createArticle);
    if (err) return next(err);
    res.redirect('/articles');
  });
});
router.post('/:id', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, req.body, (err, createArticle) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});
router.get('/:id/delete', function (req, res, next) {
  var id = req.params.id;
  Blog.findByIdAndDelete(id, (err, createArticle) => {
    if (err) return next(err);
    console.log(err, createArticle._id);
    Comments.deleteMany({ articleId: createArticle.id }, (err, info) => {
      res.redirect('/articles/');
    });
  });
});
router.post('/:id/comments', function (req, res, next) {
  var id = req.params.id;
  req.body.articleId = id;
  Comments.create(req.body, (err, comment) => {
    if (err) return next(err);
    Blog.findByIdAndUpdate(
      id,
      { $push: { comments: comment._id } },
      (err, updatedbook) => {
        if (err) return next(err);
        res.redirect('/articles/' + id);
      }
    );
  });
});
router.get('/:id/likes', (req, res) => {
  var id = req.params.id;
  Blog.findByIdAndUpdate(id, { $inc: { likes: 1 } }, (err, article) => {
    if (err) return next(err);
    res.redirect('/articles/' + id);
  });
});

module.exports = router;
