const mongoose = require("mongoose");
const postSchema = new mongoose.Schema({
    title: {type: String, required: true},
    language: {type: String, required: true},
    description: {type: String, required: true},
    body: {type: String, required: true},
    postedBy: String,
    userID: String,
    comments: [String],
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;