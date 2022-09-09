//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

const wikiDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/wikiDB', {
      useNewUrlParser: true
    })
    console.log('connected with wikiDB');
  } catch {
    console.log(error);
  }
}
wikiDB()

const articleSchema = new mongoose.Schema({
  title: String,
  content: String
})
const Article = mongoose.model('Article', articleSchema)
//TODO
// ----------------------------ROUTES
// -----------All articles
app.route('/articles')
.get(function(req, res) {
  Article.find({}, function(err, articles) {
    if (err) {
      console.log(err);
    } else {
      res.send(articles)
    }
  })

})
.post(function(req, res) {

  const newArticle = Article({
    title: req.body.title,
    content: req.body.content
  })
  newArticle.save(function(err) {
    if (!err) {
      res.send('Successfully added')
    } else {
      res.send(err)
    }
  })
})
.delete(function(req, res) {

  Article.deleteMany(function(err) {
    if (!err) {
      res.send('Deleted all articles')
    } else {
      res.send(err)
    }
  })
})
// ---------------------Specific Articles

app.route('/articles/:articleId')
.get(function(req, res){
  Article.findOne({_id: req.params.articleId}, function(err, foundArticle){
    if(err){
      res.send(err)
    } else {
      res.send(foundArticle)
    }
  })
})
.put(function(req, res){
  Article.updateOne(
    {_id: req.params.articleId},
    {title: req.body.title, content: req.body.content}, function(err){
      if(!err){
        res.send('Successfully updated article')
      }else {
        res.send(error)
      }
    }
  )
})
.patch(function(req, res){
  console.log(req.body);

  Article.updateOne(
    {_id: req.params.articleId},
    {$set: req.body},
    function(err){
    if (!err){
      res.send('Successfully title updated')
    }else {
      res.send(err)
    }
  })
}).delete(function(req, res){
  Article.deleteOne({_id: req.params.articleId}, function(err){
    if(!err){
      res.send('Successfully deleted')
    }
  })
})



// --------------------------------LISTEN
app.listen(3000, function() {
  console.log("Server started on port 3000");
});
