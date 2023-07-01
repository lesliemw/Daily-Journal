const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');
require("dotenv").config();

const homeStartingContent =
"Hi there! My name is Leslie, and I am a Full-Stack Developer. I created this blog website as part of a Web-Dev Bootcamp. Most of the styling and layout are from the course, but the code is all mine, using a combination of EJS, Node.js, and Mongoose. Try it out by clicking the 'Compose' button in the top right corner."
const aboutContent =
"My name is Leslie, I am currently doing a Web Development Bootcamp. My dreams are to some day work somewhere doing what I love-- which is creating beautiful and responsive websites."

const app = express();
app.set("view engine", "ejs");
const CONNECTION = process.env.CONNECTION;



app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Connecting to the database using mongoose.
main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(CONNECTION);
}

//Creating Schema for the posts
const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  content: {
    type: String,
    require: true,
  },
});

//Creating a mongoose model based on this Schema :

const Post = mongoose.model("Post", postSchema);

app.get("/", function (req, res) {
  // Find all items in the Posts collection and render it into our home page.
  Post.find().then((posts) => {
    res.render("home", {
      startingContent: homeStartingContent,
      posts: posts,
    });
  });
});

app.get("/about", function (req, res) {
  res.render("about", { aboutContent: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { contactContent: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

//Saved the title and the post into my database.
app.post("/compose", function (req, res) {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });

  //We are saving the post through our compose route and redirecting back into the home route. A message will be displayed in our console when a post is being saved.

  post
    .save()
    .then(() => {
      console.log("Post added to DB.");

      res.redirect("/");
    })

    .catch((err) => {
      console.log(err);
      res.status(400).send("Unable to save post to database.");
    });
});

app.get("/posts/:postId", function (req, res) {
  //We are storing the _id of our created post in a variable named requestedPostId
  const requestedPostId = req.params.postId;

  //Using the find() method and promises (.then and .catch), we have rendered the post into the designated page.

  Post.findOne({ _id: requestedPostId })
    .then(function (post) {
      res.render("posts", {
        title: post.title,
        content: post.content,
      });
    })
    .catch(function (err) {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
