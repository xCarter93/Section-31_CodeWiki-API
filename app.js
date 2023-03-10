//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const { application } = require("express");
const data = require(`${__dirname}/mongoPassword.json`);

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.set("strictQuery", false);
const db = "wikiDB";
const mongoURL = `mongodb+srv://xcarter93:${data.password}@cluster0.jwhx2lt.mongodb.net/${db}?retryWrites=true&w=majority`;
mongoose.connect(mongoURL);

const articleSchema = new mongoose.Schema({
	title: String,
	content: String,
});

const Article = mongoose.model("Article", articleSchema);

app.get("/", (req, res) => {
	res.send("Connected");
});

app
	.route("/articles")
	.get((req, res) => {
		Article.find({}, (err, articles) => {
			if (!err) {
				res.send(articles);
			} else {
				res.send(err);
			}
		});
	})
	.post((req, res) => {
		let title = req.body.title;
		let content = req.body.content;

		const article = new Article({
			title: title,
			content: content,
		});

		article.save((err) => {
			if (err) {
				res.send(err);
			} else {
				res.send("Successfully added new article.");
			}
		});
	})
	.delete((req, res) => {
		Article.deleteMany((err) => {
			if (!err) {
				res.send("Successfully deleted articles.");
			} else {
				res.send(err);
			}
		});
	});

app
	.route("/articles/:articleTitle")
	.get((req, res) => {
		Article.findOne({ title: req.params.articleTitle }, (err, article) => {
			if (!err) {
				if (article) {
					res.send(article);
				} else {
					res.send("No article found.");
				}
			} else {
				res.send(err);
			}
		});
	})
	.put((req, res) => {
		Article.replaceOne({ title: req.params.articleTitle }, req.body, (err) => {
			if (!err) {
				res.send("Successfully updated article.");
			} else {
				res.send(err);
			}
		});
	})
	.patch((req, res) => {
		Article.updateOne({ title: req.params.articleTitle }, req.body, (err) => {
			if (!err) {
				res.send("Successfully updated article");
			} else {
				res.send(err);
			}
		});
	})
	.delete((req, res) => {
		Article.deleteOne({ title: req.params.articleTitle }, (err) => {
			if (!err) {
				res.send("Successfully deleted article.");
			} else {
				res.send(err);
			}
		});
	});

app.listen(3000, () => {
	console.log("Server is up and running.");
});
