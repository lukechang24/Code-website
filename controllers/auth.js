const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const session = require("express-session");

const User = require("../models/users")

router.get("/login", (req, res) => {
    res.render("auth/login", {
        message: ""
    })
})

router.get("/signup", (req, res) => {
    res.render("auth/signup", {
        message: "",
    })
})

router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(user) {
            if(bcrypt.compareSync(req.body.password, user.password)) {
                req.session.currentUser = user;
                delete req.session.currentUser.password
                console.log(req.session.currentUser)
                req.session.username = user.username;
                req.session.userID = user._id;
                req.session.displayName = user.displayName;
                if(req.session.previousURL) {
                    res.redirect(req.session.previousURL);
                } else {
                    res.redirect("/posts");
                }
            } else {
                res.render("auth/login", {
                    message: "The username or password you entered is incorrect"
                })
            }
        } else {
            res.render("auth/login", {
                message: "The username or password you entered is incorrect"
            })
        }
    } catch(err) {
        console.log(err);
    }
})

router.post("/signup", async (req, res) => {
    try {
        if(!req.body.username || !req.body.displayName || !req.body.password) {
            res.render("auth/signup", {
                message: "Please fill out the entire form"
            })
        }
        const userExists = await User.findOne({username: req.body.username});
        if(userExists) {
            res.render("auth/signup", {
                message: "This username already exists. Please choose another one."
            });
        } else {
            const password = req.body.password;
            const passwordHash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
            const userDb = {};
            userDb.username = req.body.username;
            userDb.password = passwordHash;
            userDb.displayName = req.body.displayName;
            const createdUser = await User.create(userDb);
            req.session.currentUser = createdUser;
            delete req.session.currentUser.password
            console.log(req.session.currentUser)
            // req.session.username = createdUser.username;
            // req.session.userID = createdUser._id;
            // req.session.displayName = createdUser.displayName;
            if(req.session.previousURL) {
                res.redirect(req.session.previousURL);
            } else {
                res.redirect("/posts");
            }
        }
    } catch(err) {
        console.log(err);
    }
})

router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        err ? console.log(err) : res.redirect("/")
    })
})

module.exports = router;