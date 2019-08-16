// Dependencies:
var express = require("express");
var app = express();
var mongoose = require("mongoose");
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");

var PORT = process.env.PORT || 3000;

// Middleware:
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(express.static("public"));
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// DB:
var databaseUrl = "news";
mongoose.Promise = Promise; 
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news";
mongoose.connect(MONGODB_URI);

var db = require("./models/index");

// Get all:
app.get("/", function(req, res) {
  db.Article.find({
      saved: false
    },
    function(error, dbArticle) {
      if (error) {
        console.log(error);
      } else {
        res.render("index", {
          articles: dbArticle
        });
      }
    })
})

app.get("/scrape", function(req, res) {
  request("https://techcrunch.com/", function(error, response, html) {
    var $ = cheerio.load(html);
    $("div.post-block").each(function(i, element) {
      var title = $(element).find("a.post-block__title__link").text().trim();
      var link = $(element).find("a.post-block__title__link").attr("href");
      var intro = $(element).children(".post-block__content").text().trim();
      // Create article if able to:
      if (title && link && intro) {
        db.Article.create({
            title: title,
            link: link,
            intro: intro
          },
          function(err, data) {
            if (err) {
              console.log(err);
            } else {
              console.log(data);
            }
          });
        console.log(i);
        if (i === 10) {
          return res.sendStatus(200);
        }
      }
    });
  });
});

app.get("/saved", function(req, res) {
  db.Article.find({
      saved: true
    })
    .then(function(dbArticle) {
      res.render("saved", {
        articles: dbArticle
      })
    })
    .catch(function(err) {
      res.json(err);
    })

});

app.put("/saved/:id", function(req, res) {
  db.Article.findByIdAndUpdate(
      req.params.id, {
        $set: req.body
      }, {
        new: true
      })
    .then(function(dbArticle) {
      res.render("saved", {
        articles: dbArticle
      })
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/notes/article/:id", function(req, res) {
  db.Article.findOne({"_id":req.params.id})
    .populate("notes")
    .exec (function (error, data) {
        if (error) {
            console.log(error);
        } else {
          res.json(data);
        }
    });        
});

app.post("/submit/:id", function(req, res) {
  db.Note.create(req.body)
    .then(function(dbNote) {
      var articleIdFromString = mongoose.Types.ObjectId(req.params.id)
      return db.Article.findByIdAndUpdate(articleIdFromString, {
        $push: {
          notes: dbNote._id
        }
      })
    })
    .then(function(dbArticle) {
      res.json(dbNote);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/notes/:id", function(req, res) {

  db.Note.findOneAndRemove({_id:req.params.id}, function (error, data) {
      if (error) {
          console.log(error);
      } else {
      }
      res.json(data);
  });
});

app.listen(PORT, function() {
  console.log(`App running on PORT: ${PORT}`);
});