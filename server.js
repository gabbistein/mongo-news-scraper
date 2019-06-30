// Dependencies:
const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cheerio = require("cheerio");

// Requiring the models dir:
const db = require("./models");

const PORT = 3000;
const app = express();

// Handlebars:
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("views"));
app.use(express.static("public"));

// Mongo DB connection:
mongoose.connect("mongodb://localhost/mongoNewsScraper", { useNewUrlParser: true });

// Routing:
app.get("/scrape", function(req, res) {
    axios.get("http://www.echojs.com/").then(function(response) {
      var $ = cheerio.load(response.data);
  
      $("article h2").each(function(i, element) {
        var result = {};
  
        result.title = $(this)
          .children("a")
          .text();
        result.link = $(this)
          .children("a")
          .attr("href");
  
        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });
  
      res.send("Scrape Complete");
    });
  });

// Server listening:
app.listen(PORT, function() {
    console.log(`App running on port: ${PORT}.`);
  });
