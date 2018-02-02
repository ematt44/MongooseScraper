// Get Dependencies

var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var bodyParser = require("body-parser");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server

var request = require("request");
var cheerio = require("cheerio");
var logger = require("morgan");
var axios = require("axios");


// Require models

var Article = require("./models/Article.js");

var Note = require("./models/Note.js");



  mongoose.Promise = Promise;


  if(process.env.MONGODB_URI) {
      mongoose.connect(process.env.MONGODB_URI, {
          useMongoClient: true
      });
  } else {
      mongoose.connect("mongodb://localhost/sessionDB", {
          useMongoClient: true
      });
  }

var app = express();

// For express and handling data parsing

app.use(bodyParser.json());

// Use body-parser for handling form submissions

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));

var PORT = process.env.PORT || 8080;

// Use express.static to serve the public folder as a static directory

app.use(express.static("public"));





var db = mongoose.connection;

// This is to set up handlebars

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// If there are any errors connecting to the 

db.on("error", function(error) {
  console.log("Mongoose Error: ", error);
});

// For a successful connection

db.once("open", function() {
  console.log("Connection Successful!");
});

app.get("/", function(req, res) {
    res.render("index");
});

// This route will scrape The Boston Globe's website

app.get("/scrape", function(req, res) {

    // Each time the user "scrapes", this will remove any article the user hasn't previously saved

    db.collection("articles").remove({"savedNews":false});

    request("https://www.bostonglobe.com/", function(error, response, html) {
        var newArray = [];
        var entry = {};
        var $ = cheerio.load(html);

        $("h2.story-title").each(function(i, element) {

            // This will limit results from scrape

            if (i >= 10) {
               return false;
            }
            var result = {};
            result.title = $(this).children("a").text();
            result.link = "https://www.bostonglobe.com" + $(this).children("a").attr("href");
            result.savedNews = false;
            
            
            entry = new Article(result);

            // Get the id of the article

            entry.newsId = entry._id;

            newArray.push(entry);

            entry.save(function(err, doc) {
                if (err) {
                    // console.log(err);
                    if (err.code === 11000) { 
                        console.log("Article has already been saved");
                    }
                }
            });
        });
        var news = {newsStuff: newArray}
        res.render("scraped", news);
    });
});

// Get the save articles from the database

app.get("/saved", function(req, res) {
    console.log("Saved");
    Article.find({"savedNews": true }, function(error, doc) {
        if (error) {
            res.send(error);
        } else {
            if (doc.length === 0) {
                res.redirect("/articles");
            } else {
                var news = {newsStuff: doc}
                res.render("saved", news);
            }
        }
    })
});

// This route will get the scrapped articles from the db

app.get("/articles", function(req, res) {
   
    Article.find({"savedNews":false}, function(error, doc) {
        if (error) {
            res.send(error);
        } else {
            if (doc.length === 0) {
                res.redirect("/");
            } else {
                var news = { newsStuff: doc}
                res.render("scraped", news);
            }
        }
    });
});

// This route selects a specific id and will save or delete the article,
// and will add a note if the user enters one
// Had to use the .exec method on the following since we nee a promise

app.post("/articles/:id", function(req, res) {
    var savedNews = req.body.savedNews;

    if (savedNews === "true") {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "savedNews": true } )
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else { 
                    res.send(doc);
                }
            });
    } else if (savedNews === "false") {
        Article.findOneAndUpdate({ "_id": req.params.id }, { "savedNews": false } )
            .exec(function(err, doc) {
                if (err) {
                    console.log(err);
                } else { 
                    res.send(doc);
                }
            });
    } else {
        var newNote = new Note(req.body);
        
        newNote.save(function(error, doc) {
            if (error) {
            console.log(error);
            } else { 
                Article.findOneAndUpdate({ "_id": req.params.id }, { "note": doc._id }
                )
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else { 
                        res.send(doc);
                    }
                });
            }
        }); 
    }
});

// Show the note on a specific article

app.get("/articles/:id", function(req, res) {
    Article.findOne({ "_id": req.params.id })
    .populate("note")
    .exec(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.json(doc);
        }
    });
});

// Start the server

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});