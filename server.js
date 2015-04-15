//State variables + REQUIREMENTS

var express = require('express')
var app = express();

var ejs = require('ejs')
app.set('view engine', 'ejs')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

var methodOverride = require('method-Override')
app.use(methodOverride('_method'))

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('daapPosts.db');

var request = require('request')

//ROUTES
//redirect
app.get('/', function(req, res){
	res.redirect('/posts')
});
//show all posts
app.get('/posts', function(req, res){
	db.all('SELECT * FROM posts', function(err, data){
		if (err) {
			console.log(err);
		} else {
			var posts = data;
			console.log(posts)
		} res.render('index.ejs', {posts: data});
	});
});

//show individual post
app.get('/post:id', function(req, res){
	var id = req.params.id;
	db.get('SELECT * FROM daapPosts WHERE id = ?', id, function(err, data){
		var post_row = data;
		console.log(post_row)
		res.render('show.ejs', {thisPost: data})
	});
});











