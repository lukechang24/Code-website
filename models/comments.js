const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
    postId: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comment: String,
    liked: [String]
})

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;