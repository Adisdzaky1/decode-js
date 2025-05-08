const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const serverless = require("serverless-http"); // install via npm
const path = require("path");

const app = express();

app.use(require("morgan")("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(require("cookie-parser")());
app.use(require("express-session")({
    secret: "09e60df3-e2d7-4c10-b103-380da8d5719b",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));


fs.readdirSync(path.join(__dirname, "..", "routes")).forEach(file => {
    app.use("/", require(path.join("..", "routes", file)));
});

app.get("*", (req, res) => {
    res.status(404).render("error");
});

// Export sebagai serverless function:
module.exports = serverless(app);
