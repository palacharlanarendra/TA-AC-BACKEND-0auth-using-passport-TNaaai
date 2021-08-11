let mongoose = require('mongoose');
var Schema = mongoose.Schema;

var blogSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    likes: { type: Number, default: 0 },
    author: String,
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comments' }],
  },
  { timestamps: true }
);

var Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
