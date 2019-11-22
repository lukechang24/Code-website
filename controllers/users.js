const express = require("express");
const router = express.Router();

const User = require("../models/users")
const Post = require("../models/posts")

router.get("/:id", async (req, res) => {
    try {
        const posts = await Post.find({"creator.userID": req.params.id});
        const relatedPosts = await Post.find({"comments.creator.userID": req.params.id});
        const user = await User.findById(req.params.id);
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