const express = require('express');
const bodyParser = require("body-parser");
const fs = require("fs");
const serverless = require("serverless-http"); // install via npm
const path = require("path");

const app = express();

app.use(require("morgan")("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", "./views");
app.set("view engine", "ejs");




fs.readdirSync(path.join(__dirname, "routes")).forEach(file => {
    app.use("/", require(path.join(__dirname, "routes", file)));
});

app.get("*", (req, res) => {
    res.status(404).render("error");
});

// Export sebagai serverless function:
module.exports = serverless(app);
