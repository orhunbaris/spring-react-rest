module.exports = function(app,io) { 

    var express = require('express')
	var router = express.Router();

	app.use('/get_map/', express.static(__dirname + '/public/map/'));
	app.use('/public/map/', express.static(__dirname + '/public/map/'));
	app.use('/', express.static(__dirname + '/public/map/'));
	app.use('/images', express.static(__dirname + '/public/images/'));
	//app.use('/get_map/data/', express.static(__dirname + '/public/map/data/'));
	app.use('/game/', express.static(__dirname + '/public/game/'));

	Genre = require('./public/models/genre');
	Territory = require('./public/models/territory');
	Book = require('./public/models/book');

	// MainPage 
	router.get('/newgame', function(req, res){
		res.sendFile(__dirname + '/public/newgame.html');
	});	

	// MainPage 
	router.get('/creategame', function(req, res){
		//console.log("bubirio:",io);
		var game = require('./game')(io);
		res.sendFile(__dirname + '/public/map/');
	});	

	// Post Method Create Game 
	router.post('/creategame', function(req, res){
		var username = req.body.username;
		var howmany = req.body.howmany;
		var maplevel = req.body.maplevel;
		console.log(username,howmany,maplevel);
		var game = require('./game2')(io,username,howmany,maplevel);
		var userid = 1;
 		res.render('index', {userid: userid, username: username, maplevel: maplevel});
		//res.sendFile(__dirname + '/public/map/');
	});	

	// MainPage 
	router.get('/chat', function(req, res){
		res.sendFile(__dirname + '/public/chatpage.html');
	});	

	// MainPage 
	router.get('/', function(req, res){
		res.sendFile(__dirname + '/public/newgame.html');
	});	

	// Get Map
	router.get('/get_map',function(req,res){
		res.sendFile(__dirname + '/public/map/index.html');
	});	

		// Get Map
	router.get('/get_map/:userid',function(req,res){
		var userid = req.params.userid;
 		res.render('index', {userid: userid, username: "aloscuk", maplevel: "hard"});
		//res.sendFile(__dirname + '/public/map/index.html');
	});	

		// Get Map
	router.get('/get_map/:userid/:level',function(req,res){
		var userid = req.params.userid;
		var level = req.params.level;
 		res.render('index', {userid: userid, username: "aloscuk", maplevel: level});
		//res.sendFile(__dirname + '/public/map/index.html');
	});	


	// Get Map
	router.get('/get_map2',function(req,res){
		res.sendFile(__dirname + '/public/map/user2.html');
	});

	// Get genres from database-> first parameter: error if there is a one / second parameter: response
	router.get('/api/genres',function(req, res){
		Genre.getGenres(function(err, genres){
			if(err)
			{ throw err; }
			else
			{ res.json(genres);}
		});
	});

	// Get Books from database
	router.get('/api/books',function(req, res){
		Book.getBooks(function(err, books){
			if(err)
			{ res.send("Not found"); }
			else
			{ res.json(books); }
		});
	});

	
	// Get Book from database by ID
	router.get('/api/books/id/:_id',function(req, res){
		Book.getBookById(req.params._id, function(err, book){
			if(err)
			{ res.send("Not found"); }
			else
			{ res.json(book); }
		});
	});
	
	
	// Get Book from database by ID
	router.get('/get_territories',function(req, res){
		Territory.getAllTerritories(function(err, book){
			if(err)
			{ res.send("Not found"); }
			else
			{ res.json(book); }
		});
	});
	
	// Get Book from database by Genre
	router.get('/get_territories/:tid',function(req, res){
		Territory.getTerritoryInfantry(req.params.tid, function(err, territories){
			if(err)
			{	console.log(err);
				res.send("Not found"); 
			}
			else
			{ res.json(territories); }
		});
	});




	// Put infantry on territory by called tid 
	router.put('/putinfantry/:tid',function(req, res){
		var tid = req.params.tid;
		var updateOnTerritory = {}; // What update do we want?
		Territory.putInfantry(tid, updateOnTerritory, {}, function(err, territory){
			if(err)
			{	
				console.log(err);
				res.send("An Error Occured"); 
			}
			else
			{ res.send(territory); }
		});
	});
	




	// Get Book from database by Genre
	router.get('/api/books/genre/:_genre',function(req, res){
		Book.getBookByGenre(req.params._genre, function(err, book){
			if(err)
			{	console.log(err);
				res.send("Not found"); 
			}
			else
			{ res.json(book); }
		});
	});

	// Add a genre that accepts a POST request
	router.post('/api/genres/',function(req, res){
		var genre = req.body; // Taking parameters from request body
		Genre.addGenre(genre, function(err, genre){
			if(err)
			{	
				console.log(err);
				res.send("An Error Occured"); 
			}
			else
			{ res.json(genre); }
		});
	});
	
	// Update a genre that accepts a PUT request
	router.put('/api/genres/:_id',function(req, res){
		var id = req.params._id;
		var genre = req.body; // Taking parameters from request body
		Genre.updateGenre(id, genre, {}, function(err, genre){
			if(err)
			{	
				console.log(err);
				res.send("An Error Occured"); 
			}
			else
			{ res.json(genre); }
		});
	});
	
    return router;
}