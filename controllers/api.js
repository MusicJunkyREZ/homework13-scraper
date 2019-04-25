var express = require("express");
var app = express();
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

// app.get("/", function (req, res) {
//     console.log("scraping")

//     axios.get("https://www.dailymail.co.uk").then(function (response) {

//         var $ = cheerio.load(response);

//         $("div.article h2.linkro-darkred a").each(function (i, element) {
//             var result = {};

//             result.title = $(element)
//                 .text().trim();
//             result.link = $(element).attr("href");

//             db.Article.create(result)
//                 .then(function (dbArticle) {
//                     console.log(dbArticle)
//                 })
//                 .catch(function (err) {
//                     console.log(err)
//                 })
//         })
//         // Where images are located, outside of other div
//         // $("div.article img").each(function(i, element){
//         //     result.image = $(element).attr("src")
//         // })
//         res.send("Scrape Complete")
//         res.send(result)
//     })
// });

// app.get("/articles", function(req, res){
//     db.Article.find()
//         .then(function(articles){
//             res.json(articles)
//         })
//         .catch(function(err){
//             res.json(err)
//         });
// });

// app.get("/articles/:id", function(req, res){
//     db.Article.findOne({id_: req.params.id})
//         .populate("note")
//         .then(function(article){
//             res.json(article)
//         })
//         .catch(function(err){
//             res.json(err)
//         })
// })

// app.post("/articles/:id", function(req, res){
//     db.Note.create(req.body)
//         .then(function(note){
//             return db.Article.findOneAndUpdate({_id: req.params.id})
//         })
//         .then(function(article){
//             res.json(article)
//         })
//         .catch(function(err){
//             res.json(err)
//         })
// })



module.exports = app;
