const express = require("express");
const router = express.Router();

const Post = require("../models/posts")
const User = require("../models/users")
const Comment = require("../models/comments")

router.get("/", async (req, res) => {
    try {
        const posts = await Post.find({})
        .populate({path: "creator"});
        res.render("posts/index", {
            user: req.session.currentUser,
            posts
        });
    } catch(err) {
        console.log(err);
    }
})

router.get("/new", (req, res) => {
    if(req.session.currentUser.username) {
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
        req.body.creator = req.session.currentUser.userID;
        const post = await Post.create(req.body);
        const user = await User.findOne({username: req.session.currentUser.username});
        user.posts.push(post);
        user.save();
        res.redirect(`/posts/${post._id}`);
    }catch (err) {
        console.log(err);   
    }
})

router.post("/:id/comment", async (req, res) => {
    try {
        if(!req.body.comment) {
            res.redirect(`/posts/${req.params.id}`);
        } else if(req.session.currentUser.username) {
            // let dateFromObjectId = function(id) {
            //     return new Date(parseInt(id.substring(0, 8), 16) * 1000);
            // };
            const comment = await Comment.create({postId: req.params.id, creator: req.session.currentUser.userID, comment: req.body.comment})
            const user = await User.findOne({username: req.session.currentUser.username});
            user.comments.push(comment);
            user.save();
            // console.log(dateFromObjectId(comment._id.toString()));
            res.redirect(`/posts/${req.params.id}`);
        } else {
            req.session.previousURL = `/posts/${req.params.id}`;
            res.render("auth/login", {
                message: "You must be logged in to comment",
                currentComment: req.body.comment
            });
        }
    } catch(err) {
        console.log(err);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id})
        .populate({path: "creator"});
        const currentUser = await User.findOne({username: req.session.currentUser.username}) || {};
        const comments = await Comment.find({postId: req.params.id})
        .populate({path: "creator"});
        res.render("posts/show", {
            post,
            currentUser,
            comments
        })
    } catch(err) {
        console.log(err)
    }
})

router.delete("/:id/:commentID", async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.commentID);
        const user = await User.findOneAndUpdate({_id: comment.creator._id}, {$pull: {comments: req.params.commentID}});
        user.save();
        res.redirect(`/posts/${req.params.id}`);
    } catch(err) {
        console.log(err);
    }
})

router.delete("/:id", async (req, res) => {
    try {
        const post = await Post.findOneAndDelete({_id: req.params.id});
        res.redirect("/posts");
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;