var mongoose = require('mongoose');

// Territory has a territoryid, territoryname, number of soldier, neighbors, who owns to this territory
var gameutilsSchema = mongoose.Schema({
	gameid : {type: Number, required : true},
	currentphase : {type: Number, default: -1, required : true}, // -1 for firstturn
	currentplayer : {type: Number, default: -1, required : true}, // Who is the currentplayerid-> USER ID
	players : {type: [Number], required : true}, // Who are playing in this game
	gamefinish : {type: Boolean, default: false, required : true},
	//ownsto: {type: Number, default: -1, required:true}
});

// Now it can be accessed from outside
var Gameutils = module.exports = mongoose.model('Gameutils', gameutilsSchema );

// Get Territories
module.exports.getAllTerritories = function(callback, limit){
	Gameutils.find(callback).limit(limit);
}

// Get Game by ID
module.exports.getBookById = function(id, callback){
	GameUtils.findById(id, callback);
}

// Add a Message
module.exports.addTerritory = function(message, callback){
	Territory.create(message,callback);
}

// Update a Genre
module.exports.putInfantry = function(tid, territory, options, callback){

	// First we find the old infantry number of the territory

	var foundInfantry;	

	Territory.getTerritoryInfantry(tid, function(err, infantrynum){
		if(err)
		{ 
			console.log("error", err); 
			foundInfantry = 0;
		}
		else
	    { 
	    	// console.log("num", infantrynum[0].infantry);
	    	foundInfantry = infantrynum[0].infantry;

			var increasedInfantry = foundInfantry + 1;
			var query = {tid: tid};
			var update = { infantry: increasedInfantry };

			Territory.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
	    }
	});
}



// Update a Genre
module.exports.nextTurn = function(gameid, gameutil, options, callback){

	var userid = gameutil.userid;
	// First we find the old infantry number of the territory
	var previousPlayer;		

	Gameutils.getCurrentPlayer(gameid, function(err, prevplayer){
		if(err)
		{ 
			console.log("error: ", err);
		}
		else
	    { 
	    	console.log(prevplayer);
	    	if(prevplayer.length){
	    	// If it is really the previous player
	    	var previousPlayer = prevplayer[0].currentplayer;

		    	if(userid == previousPlayer){
					var currentPlayer = previousPlayer + 1;
					if(previousPlayer == prevplayer[0].players.length-1){
						currentPlayer = 0;
					}

					var query = {gameid: gameid};
					var update = { currentplayer: currentPlayer };
					Gameutils.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
				}
				else 
				{
					callback(300, "It is not your turn!");		
				}
			}
			else {
				callback(404, "There is not a such game.");		
			}
	    }
	});
}


// Update a Genre
module.exports.checkCurrentPlayer = function(gameid, gameutil, options, callback){

	var userid = gameutil.userid;
	// First we find the old infantry number of the territory
	var previousPlayer;		

	Gameutils.getCurrentPlayer(gameid, function(err, prevplayer){
		if(err)
		{ 
			console.log("error: ", err);
		}
		else
	    { 
	    	
	    	if(prevplayer.length){
	    	// If it is really the previous player
	    	var previousPlayer = prevplayer[0].currentplayer;

		    	if(userid == previousPlayer){
		    		callback(0, true)
				}
				else 
				{
					callback(0, false);		
				}
			}
			else {
				callback(404, "There is not a such game");		
			}
	    }
	});
}



// Increase infantry number of a territory
module.exports.putInfantry = function(tid, territory, options, callback){

	// First we find the old infantry number of the territory

	var foundInfantry;		
	console.log(tid);

	Territory.getTerritoryInfantry(tid, function(err, infantrynum){
		if(err)
		{ 
			console.log("error", err); 
			foundInfantry = 0;
		}
		else
	    { 
	    	console.log("num", infantrynum[0].infantry);
	    	foundInfantry = infantrynum[0].infantry;

			var increasedInfantry = foundInfantry + 1;
			var query = {tid: tid};
			var update = { infantry: increasedInfantry };

			Territory.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
	    }
	});
}


// Get Book by Genre it only gets 1 as limit
module.exports.getCurrentPlayer = function(gameid, callback){
	Gameutils.find({ 'gameid': gameid }, callback).select('currentplayer players -_id').limit(1);
}

// Get Book by Genre it only gets 1 as limit
module.exports.getTerritoriesByID = function(tid, callback){
	Territory.find({ 'tid': tid }, callback).limit(1);
}