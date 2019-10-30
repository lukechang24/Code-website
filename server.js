const express = require("express");
const app = express();
const PORT = 4000;
require("./db/db");

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
    next();
});

const authsController = require("./controllers/auth")
const usersController = require("./controllers/users");
const postsController = require("./controllers/posts");
app.use("/auth", authsController)
app.use("/users", usersController);
app.use("/posts", postsController);

app.get("/", (req, res) => {
    res.render("homepage")
})

app.listen(PORT, () => {
    console.log("listening")
})