var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentsSchema = new Schema(
  {
    comments: { type: String, required: true },
    articleId: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
  },
  { timestamps: true }
);

var Comments = mongoose.model('Comments', commentsSchema);
module.exports = Comments;
