// Dependencies:
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
mongoose.Promise = Promise;
const app = express();
const exphbs = require("express-handlebars");
const port = process.env.PORT || 3000;
const path = require("path");

// Middleware:
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ useNewURLParser: true }));
app.use(express.static("public"));

app.set("views", path.join(__dirname, "views/"))
app.engine("handlebars", exphbs({defaultLayout: "main"}));
app.set("view engine", "handlebars");

// DB:
mongoose.connect("mongodb://localhost/mongoNewsScraper");
const db = mongoose.connection;

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

db.once("open", function() {
  console.log("Connection successful!");
});

var routes = require("./controllers/controller.js");
app.use("/",routes);


app.listen(port, function() {
    console.log("App running on " + port);
  });