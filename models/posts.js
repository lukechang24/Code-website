const mongoose = require("mongoose");
const Comment = require('./comments').schema;
const postSchema = new mongoose.Schema({
    title: String,
    language: String,
    description: String,
    body: String,
    creator: {username: String, displayName: String, userID: String},
    comments: [Comment],
})

const Post = mongoose.model("Post", postSchema);

module.exports = Post;