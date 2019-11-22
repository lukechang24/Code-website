const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postID: String,
    creator: {displayName: String, userID: String, username: String},
    comment: String,
    likedBy: [String]
})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;