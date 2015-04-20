//State variables + REQUIREMENTS

var express = require('express')
var app = express();

var config = require('./settings')

var ejs = require('ejs')
app.set('view engine', 'ejs')

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))

var methodOverride = require('method-Override')
app.use(methodOverride('_method'))

var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('daapPosts.db');

var request = require('request')

var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(config.mandrill_key);

//ROUTES
//"authentication" page
app.get('/', function(req, res){
	//this is incorrect: needs to be username and password page sans real authentication
	// res.render('authentication.ejs', {data: data})
	res.redirect('/posts');
});

//show all posts
app.get('/posts', function(req, res){
	db.all('SELECT * FROM daapPosts', function(err, data){
		if (err) {
			console.log(err);
		} else {
			var posts = data;
			console.log(posts)
		} res.render('index.ejs', {posts: data})
	});
});

//show individual post
app.get('/post/:id', function(req, res){
	var id = req.params.id;
	db.get('SELECT * FROM daapPosts WHERE id = ?', id, function(err, data){
		var post_row = data;

		db.all('SELECT * FROM postComments WHERE postid = ?', id, function(err, data){
			var comments = data;

			console.log(post_row);
			console.log(comments);

			res.render('show.ejs', {'post': post_row, 'comments': comments})
		});

		// res.render('show.ejs', {thisPost: data})
	});


});

//server up new page to create a new post
app.get('/posts/new', function(req, res){
	res.render('new.ejs')
});
//create new post
app.post('/posts', function(req, res){
	console.log(req.body);

	db.run("INSERT INTO daapPosts(name, year, semester, city, company, roommate, email) VALUES (?,?,?,?,?,?,?)", req.body.name, req.body.year, req.body.semester, req.body.city, req.body.company, req.body.roommate, req.body.email, function(err){
		if (err) throw err;
		res.redirect('/posts');
	});

	var message = {
		"text":"See new co-op postings....",
		"subject":"Updates in your network",
		"from_email":"admin@coopconnect.com",
		"to": [{
            "email": req.body.email,
            "name": req.body.name,
            "type": "to"
        }],
	}

	mandrill_client.messages.send({"message": message, "async": false}, function(result){
		console.log(result);
	}, function(e) {
		console.log('A mandrill error occurred: ' + e.name + ' - ' + e.message);
	});

});

//sending user to 'edit/update a post' page
app.get('/post/:id/edit', function(req, res){
	var id = req.params.id;
	db.get('SELECT * FROM daapPosts WHERE id = ?', id, function(err, data){
		var post_row = data;
		console.log(post_row);
		res.render('edit.ejs', {thisPost: data})
		return
	});
});

app.post('/post/:id/comment', function(req, res){
	var id = req.params.id;
	var comment = req.body.comment;

	db.run("INSERT INTO postComments(comment, postid) VALUES (?,?)", comment, id, function(err){
		if (err) throw err;
		res.redirect('/post/' + id);
	});
});

//update a post
app.put('/post/:id', function(req, res){
	//make changes to certain post 
	db.run("UPDATE daapPosts SET name = ?, year = ?, semester = ?, city = ?, roommate = ?, email = ?", req.body.name, req.body.year, req.body.semester, req.body.city, req.body.roommate, req.body.email, function(err){
		if (err) throw err;
		rs.redirect('/post/' + parseInt(req.params.id))
	});
});

app.delete('/post/:id', function(req, res){
	db.run("DELETE FROM daapPosts WHERE id = ?", req.params.id,
		function(err){
			if (err) throw err;
			res.redirect('/posts')
		});
});

app.listen('3000');
console.log('listening on port 3000');









