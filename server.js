const express = require("express");
const app = express();
require("dotenv").config();
require("./db/db");

const PORT = process.env.PORT;


const methodOverride = require("method-override");
const session = require("express-session");

app.set("view engine", "ejs")
app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static("public"))
app.use(session({
    secret: "this is a random secret string",
    resave: false,
    saveUninitialized: false 
  }))
app.use((req, res, next) => {
    if(!req.session.currentUser) {
        req.session.currentUser = {};
    }
    res.locals.user = req.session.currentUser || {};
    console.log(res.locals.user)
    next();
});

const authsController = require("./controllers/auth")
const usersController = require("./controllers/users");
const postsController = require("./controllers/posts");
app.use("/auth", authsController)
app.use("/users", usersController);
app.use("/posts", postsController);

app.get("/", (req, res) => {
    res.redirect("/posts");
})

app.listen(PORT, () => {
    console.log("listening")
})