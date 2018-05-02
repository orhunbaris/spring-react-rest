module.exports = function(app) { 

    var express = require('express')
	var router = express.Router();

	app.use('/get_map/', express.static(__dirname + '/public/map/'));
	//app.use('/get_map/data/', express.static(__dirname + '/public/map/data/'));
	app.use('/game/', express.static(__dirname + '/public/game/'));

	Genre = require('./public/models/genre');
	Territory = require('./public/models/territory');
	Book = require('./public/models/book');

	// MainPage 
	router.get('/', function(req, res){
		res.sendFile(__dirname + '/public/mainPage.html');
	});	

	// MainPage 
	router.get('/chat', function(req, res){
		res.sendFile(__dirname + '/public/chatpage.html');
	});	

	// Get Map
	router.get('/get_map',function(req,res){
		res.sendFile(__dirname + '/public/map/index.html');
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
	


	// define the about route
	router.get('/about', function (req, res) {
	  res.send('You are in about route.')
	})

    return router;
}