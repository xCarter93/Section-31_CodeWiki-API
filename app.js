//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { application } = require("express");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
const db = "wikiDB";
const mongoURL = `mongodb+srv://xcarter93:ISXi7JvzRagD6Ub3@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL);

const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", (req, res) => {
	res.send("Connected");
});

app.get("/articles", (req, res) => {
	Article.find({}, (err, articles) => {
		if (!err) {
			res.send(articles);
		} else {
			res.send(err);
		}
	});
});

app.listen(3000, () => {
	console.log("Server is up and running.");
});
