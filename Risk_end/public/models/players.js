var mongoose = require ('mongoose');


var playersSchema = mongoose.Schema({
	gameid : {type : Number, required : true},
//	name : {type: String, required : true},
	pid : {type: Number, required : true},
	name: {type: String, required : true},
//  color : {type: color,required : true},
	infantry : {type : Number, default : 0 , required : true},
	territories : {type: [Number], default: [], required : true},
	alliance : {type: [Number], required : true}
});

var Players = module.exports = mongoose.model('Players', playersSchema );

// Creating all the territories into database
module.exports.createPlayers = function(players, callback){
	Players.insertMany(players, callback);
}

module.exports.restrictAll = function(callback, limit)
{
var newValue = {$set: {restriction : true}};
User.updateMany({},newValue,callback);

}

module.exports.whoseTurn = function(callback){

	var query = {restriction: true}
	Players.find(query)
	//Players.find(query,{_id: 0, pid:1, name:0, infantry : 0, __v:0, alliance : 0, restriction: 0});
}

module.exports.counter = function(callback){
	Players.count();
}
module.exports.unRestrict = function(pid, callback){

var query = {pid: pid};
var newValue = {restriction: false};
User.findOneAndUpdate(query, newValue,{new: true},callback);

}
// player database

module.exports.loserPlayer1 = function(pid, players, options, callback){


	Players.getPlayerInfantry(pid, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
			{
				console.log("num", infantrynum[0].infantry);
				foundInfantry = infantrynum[0].infantry;

			var newInfantry = foundInfantry - 1;
			var query = {pid: pid};
			var update = { infantry: increasedInfantry };

			Players.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
			}
	});

}

module.exports.loserPlayer2 = function(pid, territory, options, callback){
	Players.getPlayerInfantry(pid, function(err, infantrynum){
		if(err)
		{
			console.log("error", err);
			foundInfantry = 0;
		}
		else
			{
				console.log("num", infantrynum[0].infantry);
				foundInfantry = infantrynum[0].infantry;

			var newInfantry = foundInfantry - 2;
			var query = {pid: pid};
			var update = { infantry: increasedInfantry };

			Players.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
			}
	});
}


module.exports.decreaseInfantry = function(playerid, territory, options, callback){

	// First we find the old infantry number of the user
	var foundInfantry;		
	Player.getPlayerInfantry(playerid, function(err, infantrynum){
		if(err)
		{ 
			console.log("error", err); 
			foundInfantry = 0;
		}
		else
	    { 
	    	foundInfantry = infantrynum[0].infantry;
	    	console.log("foundin", foundInfantry);
	    	if(foundInfantry > 0){
				var decreasedInfantry = foundInfantry - 1;
				var query = { pid: playerid };
				var update = { infantry: decreasedInfantry };
				Player.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
			}
			else {
				callback(800, "You do not have any infantry!");
			}
	    }
	});

}


module.exports.setNewTurnInfantry = function(pid, infantry, options, callback){
	var newInfantry = infantry.infantry;
	var query = { pid: pid };
	var update = { infantry: newInfantry };
	Player.findOneAndUpdate(query, update, {new: true},callback); // It returns the updated version
}

module.exports.getPlayerInfantry = function(pid, callback){
	Players.find({ 'pid': pid }, callback).select('infantry -_id').limit(1);
}

module.exports.getPlayerTerritories = function(pid, callback){
	Players.find({ 'pid': pid }, callback).select('territories -_id').limit(1);
}

// PutInfantry on Territory
module.exports.pushTerritoryToPlayer = function(pid, updateOnPlayer, options, callback){
	var query = {pid: pid};
//	db.events.update(query, { $push : { "events" : { "profile" : 10, "data" : "X"}}}, {"upsert" : true});
	Player.findOneAndUpdate(query, updateOnPlayer, {new: true},callback); // It returns the updated version
}