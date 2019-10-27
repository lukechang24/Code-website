const express = require("express");
const router = express.Router();

const Post = require("../models/posts")
const User = require("../models/users")
const Comment = require("../models/comments")
// const nl2br = require("locutus/php/strings/nl2br");

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({});
        res.render("posts/index", {
            posts
        });
    } catch(err) {
        console.log(err);
    }
})

router.get("/new", (req, res) => {
    if(req.session.userID) {
        console.log(req.session.userID)
        res.render("posts/new");
    } else {
        req.session.previousURL = `/posts/new`;
        res.render("auth/login", {
            message: "You must be logged in to create a post"
        });
    }
})

router.post("/", async (req, res) => {
    try {
        req.body.postedBy = req.session.userID;
        const post = await Post.create(req.body);
        await post.updateOne({postedBy: req.session.userID});
        console.log(post);
        res.redirect("/posts");
    }catch (err) {
        console.log(err);   
    }
})

router.post("/:id/comment", async (req, res) => {
    try {
        if(!req.body.comment) {
            res.redirect(`/posts/${req.params.id}`);
        } else if(req.session.username) {
            // let dateFromObjectId = function(id) {
            //     return new Date(parseInt(id.substring(0, 8), 16) * 1000);
            // };
            const comment = await Comment.create({postId: req.params.id, postedBy: req.session.userID, username: req.session.username, comment: req.body.comment})
            const user = await User.findOne({username: req.session.username});
            user.comments.push(comment);
            user.save();
            console.log(comment)
            // console.log(dateFromObjectId(comment._id.toString()));
            res.redirect(`/posts/${req.params.id}`);
        } else {
            req.session.previousURL = `/posts/${req.params.id}`;
            res.render("auth/login", {
                message: "You must be logged in to comment"
            });
        }
    } catch(err) {
        console.log(err);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        const postCreator = await User.findOne({_id: post.postedBy});
        const currentUser = await User.findOne({_id: req.session.userId}) || {_id: ""};
        const comments = await Comment.find({postId: req.params.id}) || [];

        res.render("posts/show", {
            post,
            postCreator,
            currentUser,
            comments
        })
    } catch(err) {
        console.log(err)
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({_id: req.params.id});
        console.log(post)
        res.redirect("/posts");
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;