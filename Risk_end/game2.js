module.exports = function(io, username, howmany, maplevel) {

// Database connection
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/chatdb');
var db = mongoose.connection;

var client = io.sockets;
var socketCounter = 0;

	// Database table models
	Chat = require('./public/models/chat');
	Territory = require('./public/models/territory');
	Gameutils = require('./public/models/gameutils');
	Player = require('./public/models/players');

	let gameid = 1; // Will be change!
	isGameFinish = false;
	socketEvents();
	loadTerritories();

// Getting all the territories and posting to the client
function initialInfantryDeployment(){
	var gameid = 1;
	Territory.getAllTerritories(gameid, function(err, territories){
		if(err)
		{ console.log("Socket error occured."); }
		else
		{ 
			client.emit('updatedterritory', territories);
		}
	});
}

  // Each territory has a territoryid, continent, territory name, number of soldiers on it and who belongs to playerid (-1 means nobody)
var territories, players; 

function loadTerritories(){
  function Territory (gameid, tid, continent, tname, neighbors, infantry, ownsto){
    this.gameid = gameid;
    this.tid = tid;
    this.continent = continent;
    this.tname = tname;
    this.neighbors = neighbors;
    this.infantry = infantry;
    this.ownsto = ownsto;
  }

if(maplevel == "hard" || maplevel == "easy") // TODO: Custom map for easy will be implemented!
{
// All territories with their neighbors for 41 Territories
  var TER0 = new Territory(gameid, 0, 0,'Venezuela',  [ 4, 1, 2 ] , 0, -1);
  var TER1 = new Territory(gameid, 1, 0,'Brazil',  [ 3, 0, 1, 2, 13 ] , 0, -1);
  var TER2 = new Territory(gameid, 2, 0,'PERU',  [ 3, 0, 1 ] , 0, -1);
  var TER3 = new Territory(gameid, 3, 0,'Argentina',  [ 0, 1, 2 ] , 0, -1);
  var TER4 = new Territory(gameid, 4, 1,'Mexico',  [ 6, 0, 5 ] , 0, -1);
  var TER5 = new Territory(gameid, 5, 1,'Western United States',  [ 6, 4, 11, 10 ] , 0, -1);
  var TER6 = new Territory(gameid, 6, 1,'Eastern United States',  [ 10, 7, 5 ] , 0, -1);
  var TER7 = new Territory(gameid, 7, 1,'Eastern Canada',  [ 6, 10, 40 ] , 0, -1);
  var TER8 = new Territory(gameid, 8, 1,'Alaska',  [ 9, 11, 0, 32] , 0, -1);
  var TER9 = new Territory(gameid, 9, 1,'North West Territory',  [ 8, 11, 10, 40 ] , 0, -1);
  var TER10 = new Territory(gameid, 10, 1, 'Ontario',  [ 6, 11, 5, 7, 9, 40 ] , 0, -1);
  var TER11 = new Territory(gameid, 11, 1, 'Alberta',  [ 10, 8, 9, 5 ] , 0, -1);
  var TER12 = new Territory(gameid, 12, 4, 'Egypt',  [ 19, 17, 13, 14 ] , 0, -1);
  var TER13 = new Territory(gameid, 13, 4, 'North Africa',  [ 18, 1, 12, 14, 15 ] , 0, -1);
  var TER14 = new Territory(gameid, 14, 4, 'East Africa',  [ 12, 17, 27, 15, 13 ] , 0, -1);
  var TER15 = new Territory(gameid, 15, 4, 'Congo',  [ 13, 16, 14 ] , 0, -1);
  var TER16 = new Territory(gameid, 16, 4, 'South Africa',  [ 15, 27, 14 ] , 0, -1);
  var TER17 = new Territory(gameid, 17, 2, 'Middle East',  [ 12, 14, 25, 26, 20, 19 ] , 0, -1);
  var TER18 = new Territory(gameid, 18, 3, 'Western Europe',  [ 13, 19, 22 ] , 0, -1);
  var TER19 = new Territory(gameid, 19, 3, 'Southern Europe',  [ 12, 17, 22, 19, 20 ] , 0, -1);
  var TER20 = new Territory(gameid, 20, 3, 'Ukraine',  [ 31, 26, 17, 21, 22, 19 ] , 0, -1);
  var TER21 = new Territory(gameid, 21, 3, 'Scandinavia',  [ 20, 22, 24, 23 ] , 0, -1);
  var TER22 = new Territory(gameid, 22, 3, 'Northern Europe',  [ 23, 21, 19, 18, 20 ] , 0, -1);
  var TER23 = new Territory(gameid, 23, 3, 'Great Britain',  [ 24, 21, 22 ] , 0, -1);
  var TER24 = new Territory(gameid, 24, 3, 'Iceland',  [ 40, 23, 21 ] , 0, -1);
  var TER25 = new Territory(gameid, 25, 2, 'India',  [ 17, 26, 29, 28 ] , 0, -1);
  var TER26 = new Territory(gameid, 26, 2, 'Afghanistan',  [ 17, 20, 31, 25, 29 ] , 0, -1);
  var TER27 = new Territory(gameid, 27, 4, 'Madagascar',  [ 16, 14 ] , 0, -1);
  var TER28 = new Territory(gameid, 28, 2, 'Siam',  [ 37, 25, 29 ] , 0, -1);
  var TER29 = new Territory(gameid, 29, 2, 'China',  [ 26, 28, 25, 34, 31, 30 ] , 0, -1);
  var TER30 = new Territory(gameid, 30, 2, 'Mongolia',  [ 29, 34, 35, 32, 36 ] , 0, -1);
  var TER31 = new Territory(gameid, 31, 2, 'Ural',  [ 20, 34, 26, 29 ] , 0, -1);
  var TER32 = new Territory(gameid, 32, 2, 'Kamchatka',  [ 8, 36, 35, 33, 30 ] , 0, -1);
  var TER33 = new Territory(gameid, 33, 2, 'Yakutsk',  [ 35, 32, 34 ] , 0, -1);
  var TER34 = new Territory(gameid, 34, 2, 'Siberia',  [ 31, 33, 35, 30, 29 ] , 0, -1);
  var TER35 = new Territory(gameid, 35, 2, 'Irutsk',  [ 30, 33, 34, 32 ] , 0, -1);
  var TER36 = new Territory(gameid, 36, 2, 'Japan',  [ 0, 30 ] , 0, -1);
  var TER37 = new Territory(gameid, 37, 5, 'Indonesia',  [ 28, 38, 39 ] , 0, -1);
  var TER38 = new Territory(gameid, 38, 5, 'New Guinea',  [ 37, 39 ] , 0, -1);
  var TER39 = new Territory(gameid, 39, 5, 'Australia',  [ 37, 38 ] , 0, -1);
  var TER40 = new Territory(gameid, 40, 1, 'Greenland',  [ 9, 10, 7, 24 ] , 0, -1);


  territories = [TER0,TER1,TER2,TER3,TER4,TER5,TER6,
             TER7,TER8,TER9,TER10,TER11,TER12,TER13,
             TER14,TER15,TER16,TER17,TER18,TER19,TER20,
             TER21,TER22,TER23,TER24,TER25,TER26,TER27,
             TER28,TER29,TER30,TER31,TER32,TER33,TER34,
             TER35,TER36,TER37,TER38,TER39,TER40];
}
else if (maplevel == "medium"){
// uncomment these and comment above for 31 countries map
//31 countries

// Continents: 0 south america, 1 north america, 2 asia, 3 europe, 4 africa, 5 ocenia
var TER0 = new Territory(gameid, 0, 0, 'Veneru',  [ 1, 2, 3 ] , 0, -1);
var TER1 = new Territory(gameid, 1, 0, 'Brazil',  [ 0, 2, 10 ] , 0, -1);
var TER2 = new Territory(gameid, 2, 0, 'Argentina',  [ 0, 1 ] , 0, -1);
var TER3 = new Territory(gameid, 3, 1, 'Western United States',  [ 0, 4, 7 ] , 0, -1);
var TER4 = new Territory(gameid, 4, 1, 'Eastern United States',  [ 3, 5, 7 ] , 0, -1);
var TER5 = new Territory(gameid, 5, 1, 'Eastern Canada',  [ 7, 4, 29 ] , 0, -1);
var TER6 = new Territory(gameid, 6, 1, 'North Canada',  [ 7, 23, 29 ] , 0, -1);
var TER7 = new Territory(gameid, 7, 1, 'Southwestern Canada',  [ 6, 5, 4, 3, 29 ] , 0, -1);
var TER8 = new Territory(gameid, 8, 4, 'Middle Africa',  [ 9, 10, 21, 11 ] , 0, -1);
var TER9 = new Territory(gameid, 9, 4, 'Egypt',  [ 10,12,8, 14 ] , 0, -1);
var TER10 = new Territory(gameid, 10, 4, 'North Africa',  [  1, 9, 13, 14 ] , 0, -1);
var TER11 = new Territory(gameid, 11, 4, 'South Africa',  [ 8,21 ] , 0, -1);
var TER12 = new Territory(gameid, 12, 2, 'Middle East',  [ 14, 9, 8, 20, 30 ] , 0, -1);
var TER13 = new Territory(gameid, 13, 3, 'Western Europe',  [ 18, 10, 14 ] , 0, -1);
var TER14 = new Territory(gameid, 14, 3, 'Middle Europe',  [ 18, 13, 15, 16, 12, 9 ] , 0, -1);
var TER15 = new Territory(gameid, 15, 3, 'Ukraine',  [ 16, 12, 14, 30] , 0, -1);
var TER16 = new Territory(gameid, 16, 3, 'Scandinavia',  [ 15, 19, 14, 18 ] , 0, -1);
var TER17 = new Territory(gameid, 17, 2, 'Middle Russia',  [ 24, 23, 22 ] , 0, -1);
var TER18 = new Territory(gameid, 18, 3, 'Great Britain',  [ 19, 14, 16,13 ] , 0, -1);
var TER19 = new Territory(gameid, 19, 3, 'Iceland',  [ 29, 18, 16 ] , 0, -1);
var TER20 = new Territory(gameid, 20, 2, 'India',  [ 26, 22, 12, 30 ] , 0, -1);
var TER21 = new Territory(gameid, 21, 4, 'Madagascar',  [ 11, 8 ] , 0, -1);
var TER22 = new Territory(gameid, 22, 2, 'China',  [ 25, 17, 23, 26, 20, 24,30 ] , 0, -1);
var TER23 = new Territory(gameid, 23, 2, 'Kamchatka',  [ 6, 25, 22, 17 ] , 0, -1);
var TER24 = new Territory(gameid, 24, 2, 'Siberia',  [ 22, 17, 30] , 0, -1);
var TER25 = new Territory(gameid, 25, 2, 'Japan',  [ 23, 22 ] , 0, -1);
var TER26 = new Territory(gameid, 26, 5, 'Indonesia',  [ 22, 28, 27,20 ] , 0, -1);
var TER27 = new Territory(gameid, 27, 5, 'New Guinea',  [ 26, 28 ] , 0, -1);
var TER28 = new Territory(gameid, 28, 5, 'Australia',  [ 26, 27 ] , 0, -1);
var TER29 = new Territory(gameid, 29, 1, 'Greenland',  [ 19, 5, 6 , 7  ] , 0, -1);
var TER30 = new Territory(gameid, 30, 2, 'Western Asia',  [ 24, 12, 15, 20, 22 ] , 0, -1);

territories = [TER0,TER1,TER2,TER3,TER4,TER5,TER6,
				   TER7,TER8,TER9,TER10,TER11,TER12,TER13,
				   TER14,TER15,TER16,TER17,TER18,TER19,TER20,
				   TER21,TER22,TER23,TER24,TER25,TER26,TER27,
				   TER28,TER29,TER30];
}
    function Player(gameid, pid, name, infantry, territories){
    	this.gameid = gameid;
	    this.pid = pid;
	    this.name = name;
	    this.infantry = infantry;
	    this.territories = territories;
  	}


	  // Assumed 3 people: params: id, player name, color,territories, number of soldiers
	  var PLAYER1 = new Player(gameid, 0, "Alaattin", 20, []);
	  var PLAYER2 = new Player(gameid, 1, username, 20, []);
	  var PLAYER3 = new Player(gameid, 2, "Orhun", 20, []);
	  players = [ PLAYER1, PLAYER2, PLAYER3 ];

	  let territoryCount = territories.length;
	  let playerCount = 3;

  // Assumed 3 people is playing
  let firstEachInfantry = Math.floor(60/40 + 1);
/*
  // Predetermined infantry deployment for the initial map
    for (var i = 0, j = 0; i < territories.length; i++){
      territories[i].ownsto = j;
      territories[i].infantry++;
      players[j].territories.push(i); // Territory added to that player
      players[j].infantry--;
      j++;
      if(j == 3)
      { j = 0; }
    }

  // Infantry deployment continues for the first turn
	for (var i = 0; i < playerCount; i++){
		//console.log(players[i].territories)
	    for (var j = 0; j < players[i].territories.length; j++){
	    	var tobeput = Math.floor(players[i].infantry/players[i].territories.length+1);
	    	territories[players[i].territories[j]].infantry +=  tobeput;
	    	//console.log(territories[players[i].territories[j]].infantry);
	    	players[i].infantry -= tobeput;
	    }
	    players[i].infantry = 0; // Initially players have no infantry for the first turn to be played by users
	    console.log(players[i].infantry);
	}
*/

	for (var i = 0; i < territories.length-1; i++){
		territories[i].ownsto = 1;
		territories[i].infantry = 20;
		players[1].territories.push(i);
	}
	territories[40].infantry = 1;
	territories[40].ownsto = 2;
	players[2].territories.push(40);
	//players[2].territories = [];

	//players[2].territories = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40];
}

	// Adding the territories into database
	Territory.createTerritories(territories, function(err, docs){
		if(err)
		{
		 console.log("Territories could not be created."); }
		else
		{

			console.log("playerlarımız bunlar: ",players);

			//console.log(docs);
		} 	// Emit the messages
	});			

	Player.createPlayers(players, function(err, docs){
		if(err)
		{
		 console.log("Players could not be created."); }
		else
		{
			//console.log(docs);
		} 	
	});


function socketEvents(){

/*
	io.sockets.on('connection', function(socket){
	  	console.log('Socket connected.');
	});
*/
	client.on('connection', function(socket)
	{
		socketCounter++;
		console.log("people: ", socketCounter);
		socket.removeAllListeners();
		
		initialInfantryDeployment();

		// Getting messages from database
		socket.on('getmsgs', function(data){
		//	console.log("i am called");
			Chat.getChats(data.gameid, function(err, chats){
				if(err)
				{ console.log("Socket error occured."); }
				else
				{ //console.log(chats);
				socket.emit('outputmsg', chats); } 	// Emit the messages
			});

		});

		 sendStatus = function(s)
		 {
		 	socket.emit('status', s);
		 }

	 // Handle input events

	 /*
		 	socket.on('putinfantry', function(data){
		 		let tid = data.tid;
		 		//let message = data.message;

		 		// Check for name and message
		 		if(0) // deactivated
		 		{
		 			sendStatus('Please enter a name and message');
		 		}
		 		else
		 		{
					var updateOnTerritory = {};
		 			Territory.putInfantry(tid, updateOnTerritory, {}, function(err, territory){
						if(err)
						{
							console.log(err);
							sendStatus('An error occured.');
						}
						else
						{
						 //console.log(territory);
						 territories[territory.tid] = territory; // Updating the local territory
						 console.log(territories);
						 client.emit('updatedterritory', [territory]);
						}
					});

		 		}

		 	});

		 	*/
		 	// Reinforcement call
		 	socket.on('reinforcement', function(data){
		 			//let gameid = data.gameid;
		 			let playerid = data.pid;
		 			let tid = data.tid;
					var updateOnPlayer = {};

					// First decreasing of infantry units of the player
		 			Player.decreaseInfantry(playerid, updateOnPlayer, {}, function(err, player){
						if(err == 800)
						{
							console.log("You do not have any infantry left!");
						}

						else
						{	
							var updateOnTerritory = {};
							// Putting infantry on the territory
				 			Territory.putInfantry(tid, updateOnTerritory, {}, function(err, territory){
								if(err)
								{
									console.log(err);
									sendStatus('An error occured.');
								}
								else
								{
									// console.log(territories[tid]);
									 client.emit('leftinfantry', [player]);
									 client.emit('updatedterritory', [territory]);						 
									 territories[tid] = territory; // Updating the local territory array
								}
							});

						   //client.emit('currentplayer', [[gameutil]]);
						}
					});

		 	});

			
			
			socket.on('startWar', function(data){
			//let gameid = data.gameid;
			var attackTerritory = data.attacker;
			var defenseTerritory = data.defender;
			var attackPlayerId = 	territories[attackTerritory].ownsto;
			var defensePlayerId = territories[defenseTerritory].ownsto;
			var updateOnPlayer = {};
			var updateOnTerritory = {};
			var attackArmies = territories[attackTerritory].infantry;
			var defenseArmies = territories[defenseTerritory].infantry;
			console.log("atak sayı", attackArmies, "defans sayı", defenseArmies);
			console.log("bu bır data", data);
			var battle=function(attack,defense){
			var a=0;
			var d=0;
			//roll attack dice
			var attackDice= new Array();
			for (a=1; a <= attack; a++){
				attackDice[a]=Math.floor(Math.random()*6)+1;
				if(a===1){
					attackHigh=attackDice[1];
				//	console.log("Condition A1");
				}
				else if(a===2){
					attackHigh=Math.max(attackDice[1],attackDice[2]);
					attackLow=Math.min(attackDice[1],attackDice[2]);
				//	console.log("Condition A2");
				}
				else if (a===3){
					attackHigh=Math.max(attackDice[1], attackDice[2],attackDice[3]);
					attackDice.sort();
					//console.log(attackDice);
					attackLow=attackDice.slice(1,2);
				//	console.log("Condition A3");
				}
			}

			//roll defense dice
			var defenseDice= new Array();
			for (d=1; d <= defense; d++){
				defenseDice[d]=Math.floor(Math.random()*6)+1;

				if(d===1){
					defenseHigh=defenseDice[1];
				//	console.log("Condition D1");
				}
				else if(d===2){
					defenseHigh=Math.max(defenseDice[1],defenseDice[2]);
					defenseLow=Math.min(defenseDice[1],defenseDice[2]);
				//console.log(defenseDice);
			//	console.log("Condition D2");

				}

			}

		//compare attack and defense
		if (attackHigh > defenseHigh){
			defenseArmies--;
			console.log("D Loses");
		}
		else{
			attackArmies--;
				console.log("A Loses");
		}

		//compare if 2 dice
		if (a>2 && d>2){
			if (attackLow > defenseLow){
			defenseArmies--;
				console.log("D Loses");
		}
		else{
			attackArmies--;
				console.log("A Loses");
		}
		}
		console.log(a,' Attackers vs. ',d,"Defenders");

		if(attackArmies>1 && defenseArmies>0){
			var updateOnAttackTerritory = {infantry: attackArmies, ownsto: territories[attackTerritory].ownsto};
			territoryAfterWar(attackTerritory, updateOnAttackTerritory);

			var updateOnDefenseTerritory = {infantry: defenseArmies, ownsto: territories[defenseTerritory].ownsto};
			territoryAfterWar(defenseTerritory, updateOnDefenseTerritory);
		}
		else if(attackArmies == 1 && defenseArmies>0){
			var updateOnAttackTerritory = {infantry: attackArmies, ownsto: territories[attackTerritory].ownsto};
			territoryAfterWar(attackTerritory, updateOnAttackTerritory);

			var updateOnDefenseTerritory = {infantry: defenseArmies, ownsto: territories[defenseTerritory].ownsto};
			territoryAfterWar(defenseTerritory, updateOnDefenseTerritory);
		}
		else if(defenseArmies == 0){
			var updateOnAttackTerritory = {infantry: 1, ownsto: territories[attackTerritory].ownsto};
			territoryAfterWar(attackTerritory, updateOnAttackTerritory);

			var updateOnDefenseTerritory = {infantry: attackArmies-1, ownsto: territories[attackTerritory].ownsto};
			territoryAfterWar(defenseTerritory, updateOnDefenseTerritory);
	

			var playerid = territories[attackTerritory].ownsto;
			var updateOnPlayer = { $push: { territories: defenseTerritory } };
			
				Player.pushTerritoryToPlayer(playerid, updateOnPlayer, {}, function(err, player){
					if(err)
					{
						console.log(err);
						sendStatus('An error occured.');			
							console.log("burada hatalar var");
					}
					else
					{
						players[playerid] = player; // Updating the local territory array
						console.log("push döndü sanırım", player);
						client.emit('leftinfantry', [player]);

						if(player.territories.length == territories.length){
							isGameFinish = true;
							var gameFinish = { winner: player.pid };
							client.emit('gamefinish', [gameFinish]);
						}

					}
				});




		}

		};
			if (attackArmies>3 ){
					attack=3;
				}
				else if (attackArmies===3){
					attack=2;
				}
				else if (attackArmies===2){
					attack=1;
				}
		//Determine number of Defense dice
			if(defenseArmies>1){
				defense=2;
			}
			else if(defenseArmies===1){
				defense=1;
			}
		battle(attack,defense);
		console.log("Remaining Attackers:",attackArmies,"Remaining Defenders:",defenseArmies);

});


		function territoryAfterWar(changedTerritory,updateOnTerritory){
			Territory.territoryAfterWar(changedTerritory, updateOnTerritory, {}, function(err, territory){
					if(err)
					{
						console.log(err);
						sendStatus('An error occured.');
					}
					else
					{
						// console.log(territories[changedTerritory]);
						 //client.emit('leftinfantry', [player]);
						 territories[changedTerritory] = territory; 
						 client.emit('updatedterritory', [territory]);
						 // Updating the local territory array
					}
				});
		}
			
			
			
			
		 	// Gets currentplayer from database and sends to the all clients
		 	socket.on('getcurrentplayer', function(data){
		 		let gameid = data.gameid;
		 		//let message = data.message;

		 		// Check for name and message
		 		if(0) // deactivated
		 		{
		 			sendStatus('Please enter a name and message');
		 		}
		 		else
		 		{
		 			Gameutils.getCurrentPlayer(gameid, function(err, gameutil){
						if(err == 100)
						{
							console.log(err);
						}
						else
						{
							console.log("gamutil: ",gameutil);
						   client.emit('currentplayer', [gameutil]);
						}
					});
		 		}

		 	});

		 	// Endturn call ends the turn and decides the next player 
		 	socket.on('endturn', function(data){
		 		let gameid = data.gameid;
		 		let userid = data.userid;

		 		// Check for name and message
		 		if(0) // deactivated
		 		{
		 			sendStatus('Please enter a name and message');
		 		}
		 		else
		 		{
					var updateOnGame = {userid: userid};
					// Setting the next player
		 			Gameutils.nextTurn(gameid, updateOnGame, {}, function(err, gameutil){
						if(err == 100)
						{
							console.log(err);
						}
						else if (err == 404 || err == 300)
						{
						   client.emit('status', [gameutil]);
						}

						else
						{

						// Now for the new turn the currentplayer is determined
						// We need to set his infantry number in this new turn
						//Player.setNewTurnInfantry(gameutil.currentplayer)
						//console.log("bubir game util: ", gameutil.currentplayer);

						// Getting the territories that player has to decide how many infantry can he put in his new turn
						   	Player.getPlayerTerritories(gameutil.currentplayer, function(err, players){
							if(err)
								{
									console.log(err);
								}
							else
								{
									var occupiedTerritoryNum = 0;
									var newTurnInfantryNum = 0;

									// Getting occupied number of territories of the user
									if(players[0] != undefined)
									{
										occupiedTerritoryNum = players[0].territories.length;
									}

									if (occupiedTerritoryNum <= 9)
									{
										newTurnInfantryNum = 3;
									}
									else 
									{
										// New turn infantry number 
										newTurnInfantryNum = Math.floor(occupiedTerritoryNum/3 + 1);;
									}

									var updateOnPlayer = {infantry: newTurnInfantryNum}; 
							// TODO: CONTINENT CONTROL MUST BE ADDED: checkContinentControl(players[0].territories);
									Player.setNewTurnInfantry(gameutil.currentplayer, updateOnPlayer, {}, function(err, player){
									if(err)
									{
										console.log(err);
									}
									else
									{
										client.emit('currentplayer', [[gameutil]]);
									}
									});
									
									client.emit('currentplayer', [[gameutil]]);
								}
							});


						}


					});

		 		}

		 	});


	 // Handle input events when there is a new message
		 	socket.on('newmessage', function(data){
		 		let gameid = data.gameid;
		 		let name = data.name;
		 		let message = data.message;

		 			//var msg = ; // Taking parameters from request body
		 			// Adding the message to the database
					Chat.addMessage({gameid: gameid, name: name, message: message}, function(err, msg){
						if(err)
						{
							console.log(err);
							res.send("An Error Occured");
						}
						else
						{
							//console.log(msg);
							client.emit('outputmsg', [data]);
							// Send status object
		 				 }

					});


		 	});


		socket.on('disconnect', function() {
			socketCounter--; 
			console.log("disc people: ",socketCounter);
		});
	});
	

}

}
