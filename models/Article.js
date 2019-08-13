var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  },
  saved: {
    type: Boolean,
    default: false
  },
  articleID: {
    type: Number,
    required: true,
    unique: true
  }
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
