const express = require("express");
const router = express.Router();

const User = require("../models/users")
const Post = require("../models/posts")

router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        res.render("users/index", {
            users
        })
    } catch(err) {
        console.log(err);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const posts = await Post.find({"creator.userID": req.params.id});
        const relatedPosts = await Post.find({"comments.creator.userID": req.params.id});
        console.log(relatedPosts[0].comments, "related");
        console.log(posts, "posts");
        const user = await User.findById(req.params.id);
        console.log(user);
        res.render("users/show", {
            user,
            posts,
            relatedPosts
        })
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;