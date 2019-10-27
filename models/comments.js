const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postId: String,
    postedBy: String,
    username: String,
    comment: String,
    liked: [String]
})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;