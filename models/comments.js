const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postId: String,
    commentedBy: String,
    userID: String,
    comment: String,
    liked: [String]
})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;