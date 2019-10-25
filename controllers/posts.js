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

router.get("/new", async (req, res) => {
    const user = await User.findOne({username: req.session.username});
    res.render("posts/new", {
        user
    });
})

router.post("/", async (req, res) => {
    try {
        const post = await Post.create(req.body);
        const user = await User.findOne({username: req.session.username});
        await post.updateOne({postedBy: user._id});
        console.log(post);
        res.redirect("/posts");
    }catch (err) {
        console.log(err);   
    }
})

// router.post("/:id", async (req, res) => {
//     try {
//         console.log(req.session.username)
//         if(req.body.comment === "") {
//             res.redirect(`/codes/${req.params.id}`);
//         } else {
//             const code = await Code.findByIdAndUpdate(req.params.id, {$push: {comments: req.body.comment}})
//             const user = await User.findOne({username: req.session.username});
//             user.comments.push(req.body.comment);
//             const user = await User.findOneAndUpdate({username: req.session.username}, {$push: {comments: code}}, {new: true});
//             // await user.save();
//             console.log(user);
//             res.redirect(`/codes/${req.params.id}`)
//         }
//     } catch(err) {
//         console.log(err);
//     }
// })

router.post("/:id/comment", async (req, res) => {
    try {
        const comment = await Comment.create({postId: req.params.id, comment: req.body.comment})
        const user = await User.findOne({username: req.session.username});
        user.comments.push(comment);
        user.save();
        res.redirect(`/posts/${req.params.id}`)
    } catch(err) {
        console.log(err);
    }
})

router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findOne({_id: req.params.id});
        const creatorId = post.postedBy;
        const postCreator = await User.findOne({_id: creatorId})
        const currentUser = await User.findOne({_id: req.session.userId});
        console.log(postCreator._id, "This is post creator")
        console.log(currentUser._id, "This is currentUser")
        const comments = await Comment.find({postId: req.params.id}) || [];
        res.render("posts/show", {
            post,
            postCreator,
            currentUser,
            comments,
        })
    } catch(err) {
        console.log(err)
    }
})

module.exports = router;