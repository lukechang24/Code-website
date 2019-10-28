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
        const user = await User.findById(req.params.id)
        .populate({path: "posts"});
        res.render("users/show", {
            user
        })
    } catch(err) {
        console.log(err);
    }
})

module.exports = router;