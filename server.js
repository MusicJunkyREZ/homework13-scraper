var express = require("express");
var mongoose = require("mongoose"); //Mongo object modelling 
var logger = require("morgan"); //Makes http calls
var axios = require("axios");
var cheerio = require("cheerio"); //Scraper

// Require all models
var db = require("./models");

// Port configuration for local/Heroku
var PORT = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Use body-parser for handling form submissions
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/homework13", { useNewUrlParser: true });

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/homework13";

mongoose.connect(MONGODB_URI);


// Use express.static to serve the public folder as a static directory
// app.use(express.static("public"));
// // Controllers
// var router = require("./controllers/api.js");
// app.use(router);
// // Connect to the Mongo DB
// var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

// // Set mongoose to leverage built in JavaScript ES6 Promises
// // Connect to the Mongo DB
// mongoose.Promise = Promise;
// mongoose.connect(MONGODB_URI);
var url = "https://www.dailymail.co.uk/"

app.get("/scrape", function (req, res) {
    console.log("scraping")

    axios.get(url).then(function (response) {

        // console.log(response)
        var $ = cheerio.load(response.data);

        $("div.article h2.linkro-darkred a").each(function (i, element) {
            var result = {};
            console.log(element)

            result.title = $(element)
                .text().trim();
            result.link = $(element).attr("href");

            db.Article.create(result)
                .then(function (dbArticle) {
                    console.log(dbArticle)
                })
                .catch(function (err) {
                    console.log(err)
                })
            res.redirect("/")
            
        })
        // Where images are located, outside of other div
        // $("div.article img").each(function(i, element){
        //     result.image = $(element).attr("src")
        // })
        res.send("Scrape Complete")
    })
});

app.get("/", function(req, res){
    db.Article.find({})
       .then(function(dbArticle){
        let hbsObject;
        hbsObject = {
            articles: dbArticle
        };
        res.render("index", hbsObject)
        })
        .catch(function(err){
            res.json(err)
        })
});

app.get("/saved", function(req, res){
    db.Article.find({isSaved: true})
        .then(function(retrievedArticles){
        let hbsObject;
        hbsObject = {
            articles: retrievedArticles
        }
        res.render("saved", hbsObject)
        })
        .catch(function(err){
            res.json(err)
        })
})

app.put("/saved/:id", function(req, res){
    db.Article.findOneAndUpdate({_id: req.params.id}, {isSaved: true})
        .then(function(data){
            res.json(data)
        })
        .catch(function(err){
            res.json(err)
        })
})

app.put("/delete/:id", function(req,res){
    db.Article.findOneAndUpdate({_id: req.params.id}, {isSaved: false})
        .then(function(data){
            console.log("Deleted!")
            res.json(data)
        })
        .catch(function(err){
            res.json(err)
        })
})

app.get("/articles", function(req, res){
    db.Article.find()
        .then(function(articles){
            res.json(articles)
        })
        .catch(function(err){
            res.json(err)
        });
});

app.get("/articles/:id", function(req, res){
    db.Article.findOne({id_: req.params.id})
        .populate("note")
        .then(function(article){
            res.json(article)
        })
        .catch(function(err){
            res.json(err)
        })
})

app.post("/articles/:id", function(req, res){
    db.Note.create(req.body)
        .then(function(note){
            return db.Article.findOneAndUpdate({_id: req.params.id})
        })
        .then(function(article){
            res.json(article)
        })
        .catch(function(err){
            res.json(err)
        })
})



// Start the server

app.listen(PORT, function () {
    console.log(`This application is running on port: ${PORT}`)
});