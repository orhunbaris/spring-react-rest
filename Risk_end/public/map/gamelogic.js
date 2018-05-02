        var countriesLayer;
        var current_player;
        var lastClick, lastClickedTerritory;
        var fortifyTerritoryFromLayer, fortifyTerritoryToLayer, fortifyTerritoryFrom, fortifyTerritoryTo, fortifyTerritoryToSave;
        var attackTerritoryFromLayer, attackTerritoryToLayer, attackTerritoryFrom, attackTerritoryTo, attackTerritoryToSave;
        var fortifyFrom = null;
        var attackFrom = null;
        var gameid = 1;
        var leftInfantry = -1;
        var territories;
        var mapTerritories = [];
        var players = [];
        var isCancelled = false;
        var isGameFinished = false;
        var currentPhase = 0;
        let REINFORCEMENT = 1;
        let ATTACK = 2;
        let FORTIFY = 3;
 //       var attackTerritoryToSave,fortifyTerritoryToSave;
        var socket = io.connect();

        if(socket != undefined)
        {
          console.log("Socket connected to server.");
        }


        function Player(id, name, color, territories, infantry){
          this.id = id;
          this.name = name;
          this.color = color;
          this.territories = territories;
          this.infantry = infantry;
        }



        // Initally nobody is playing (-1)
        var currentPlayer = -1;

        // The turn is belong to playerid nobody else is allowed to play
        function setTurn(playerid)
        {
          currentPlayer = playerid;
          setStatus("Turn is now at "+currentPlayer);
          reinforcePhaseStyle();
          //resetAttributes();
        }

        // INITIAL SETUP
        // Assumed 3 people: params: id, player name, color,territories, number of soldiers
        var PLAYER1 = new Player(0, "Alaattin", [], 20);
        var PLAYER2 = new Player(1, "Misra", [], 20);
        var PLAYER3 = new Player(2, "Orhun", [], 20);

        // Adding all the players
        players.push(PLAYER1, PLAYER2, PLAYER3);

      //  var USER = PLAYER2; // Lets assume we are player2

      // TODO: !!!!!!!! at /creategame there is not a user id defined
      var USER = players[userid];
      let playerCount = players.length;


        function highlightFeatureNULL(){}

        // At the first turn people will be asked to put up to 20 infantries on territories
        var firstTurn = true;

        // This function will be called at the first initialization of layers
        function countriesOnEachFeature(feature, layer)
        {

          mapTerritories.push(layer); // Loading every map territory to an array to reach easily
          layer.on({mouseover : highlightFeatureNULL, mouseout : highlightFeatureNULL, click :whenClicked});
          // Initial soldier number on each territory
          //layer.bindTooltip(getInfantry(layer).toString(), {permanent:true,direction:'center',className: 'countryLabel'});
        }

        // TODO: GetCurrentPlayer() from database can be added!!!

        currentPhase = -1; // Assume the current phase is firstturn
        firstTurn = false;

        var initialization = true;

        // When user clicks a territory this function invokes
        function whenClicked(e)
        {

          if(currentPlayer == USER.id && !isGameFinished)
          {

            var clickedTerritoryLayer = e.target;  // Layer corresponds to Countries/Territories
            var clickedTerritory = mapTerritories.indexOf(clickedTerritoryLayer); // Which territory did I clicked? It search it from map territory
            // TODO: Conditions must be added: REINFORCE, ATTACK, FORTIFY
            if(firstTurn && (firstTurnInfantries < 20)){
              //  putInfantry(clickedTerritoryLayer); // Add infantry on this territory
                putInfantry(clickedTerritory);
              }
            else if (!firstTurn){

          // At reinforcement phase user can only put infantries on his/her own territory
            if(currentPhase == REINFORCEMENT){
              if(territories[clickedTerritory].ownsto == USER.id){ // this check will be done in server
              putInfantry(clickedTerritory);
                if(leftInfantry == 0){
                  setStatus("You do not have any infantry.");
                }
                else {
                  setStatus("You reinforced a territory.");
                }
              }
              else {
                setStatus("You can not reinforce a territory which you do not have.");
              }
            }

            else if (currentPhase == ATTACK)
          {
              //fortifyPhaseStyle();

              if (attackFrom == null)
              {
                  isCancelled = false;
                  attackFrom = clickedTerritoryLayer;
                  attackTerritoryFromLayer = clickedTerritoryLayer;
                  attackTerritoryFrom = clickedTerritory;

                  if(territories[attackTerritoryFrom].infantry >= 2 && territories[attackTerritoryFrom].ownsto == USER.id) // checks if the clicked territory has at least 2 infantry and owned by current player
                   {
                      nextPhaseBtn.disabled = true;
                      clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'red', fillOpacity: 1});

                      if(highlightAttackables (attackTerritoryFrom) == 0)
                      {
                        setStatus("There is no neighbor to attack from that territory");
                        resetHighlightTerritory(attackTerritoryFromLayer);
                        nextPhaseBtn.disabled = false;
                        attackFrom = null;
                     }
                     else 
                     {
                      nextPhaseBtn.disabled = true;
                      setStatus("You are attacking from "+ attackTerritoryFromLayer.feature.properties.NAME +", please select a territory to ATTACK TO");
                     }

                   }
                   else // choose again
                   {
                    attackFrom = null;
                    setStatus("You need to choose another country!");
                   }

              }
              else if (attackTerritoryTo != null && isCancelled){ // NOTE player can attack multiple times
                   isCancelled = false;
                   setStatus("You can not attack more than one territory!");
              }

              else
              {

                    attackTerritoryToLayer = clickedTerritoryLayer;
                    attackTerritoryTo = clickedTerritory;

                    if(canAttack(attackTerritoryFrom,attackTerritoryTo) && attackTerritoryToSave == null )
                    {
                      attackTerritoryToSave = attackTerritoryTo; // NOTE to prevent bugs for clicking his/her country again, also this will send to game.js
                    clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'red', fillOpacity: 1});
                    nextPhaseBtn.disabled = true;
                   //  var attackHTML = '<button id="attackbutton" type="button" class="btn btn-attack" >Attack</button> ';
                   clickedTerritoryLayer.bindPopup('<center><b>Are you sure to attack?</b> <br><br><button id="attackbutton" type="button" class="btn btn-attack" onClick="confirmAttack()">Attack</button><button id="attackbutton" type="button" class="btn btn-attack" onClick="cancelAttack()">Cancel</button><br><br>');
                   clickedTerritoryLayer.openPopup();// pop up a confirmation message
                  //  clickedTerritoryLayer.unbindPopup();
                    setStatus("Please click to NEXTPHASE to finish your attack to " + clickedTerritoryLayer.feature.properties.NAME);
                  }

                  else
                  {
                      if(attackTerritoryToSave != null) // if already choosed a valid country to attack
                      {
                          attackTerritoryTo=attackTerritoryToSave;
                          nextPhaseBtn.disabled = true;
                          setStatus("You need to cancel first! ");
                      }
                      else // if the country is not valid
                      {
                        attackTerritoryTo=null;
                        setStatus("Please choose another country! ");
                      }
                  }
              }
          }














            else if (currentPhase == FORTIFY){
              //fortifyPhaseStyle();
              if (fortifyFrom == null){

                  isCancelled = false;
                  fortifyFrom = clickedTerritoryLayer;
                  fortifyTerritoryFromLayer = clickedTerritoryLayer;
                  fortifyTerritoryFrom = clickedTerritory;
                  setStatus("Please select a territory to fortify");

                   // checks if the clicked territory has at least 2 infantry and owned by current player
                   if(territories[fortifyTerritoryFrom].infantry >= 2 && territories[fortifyTerritoryFrom].ownsto == USER.id){
                      
                      clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'green', fillOpacity: 0.5});

                     if(highlightFortifyables (fortifyTerritoryFrom) == 0){
                      setStatus("There is no neighbor to fortify from that territory");
                      resetHighlightTerritory(fortifyTerritoryFromLayer);
                      nextPhaseBtn.disabled = false;
                      fortifyFrom = null;
                      //
                     }
                     else {
                      nextPhaseBtn.disabled = true;
                      setStatus("You are fortifying from "+ fortifyTerritoryFromLayer.feature.properties.NAME +", please select a territory to FORTIFY TO");
                      }


                   }
                   else // choose again
                   {
                    fortifyFrom =null;
                    setStatus("You need to choose another country!");
                   }

              }

              else if (fortifyTerritoryTo != null && isCancelled){ // NOTE player can attack multiple times
                   isCancelled = false;
                   setStatus("You can not attack more than one territory!");
              }

              else {

                  fortifyTerritoryToLayer = clickedTerritoryLayer;
                  fortifyTerritoryTo = clickedTerritory;

                  if(canFortify(fortifyTerritoryFrom, fortifyTerritoryTo) && fortifyTerritoryToSave == null )
                  {
                  fortifyTerritoryToSave = fortifyTerritoryTo; // NOTE to prevent bugs for clicking his/her country again, also this will send to game.js
                  clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'yellow', fillOpacity: 0.7});
                  nextPhaseBtn.disabled = true;
                   //  var attackHTML = '<button id="attackbutton" type="button" class="btn btn-attack" >Attack</button> ';
                  clickedTerritoryLayer.bindPopup('<center><b>How many infantry do you want to fortify?</b> <br><br><button id="attackbutton" type="button" class="btn btn-attack" onClick="Attack()">Attack</button><button id="attackbutton" type="button" class="btn btn-attack" onClick="cancelFortify()">Cancel</button><br><br>');
                  clickedTerritoryLayer.openPopup();// pop up a confirmation message
                  //  clickedTerritoryLayer.unbindPopup();
                    setStatus("Please click to NEXTPHASE to finish your attack to " + clickedTerritoryLayer.feature.properties.NAME);
                  }
                  
                  else
                  {
                      if(fortifyTerritoryToSave != null) // if already choosed a valid country to attack
                      {
                          fortifyTerritoryTo=fortifyTerritoryToSave;
                          nextPhaseBtn.disabled = true;
                          setStatus("You need to cancel or complete your fortify first! ");
                          //fortifyTerritoryTo.openPopup();
                      }
                      else // if the country is not valid
                      {
                        fortifyTerritoryTo=null;
                        setStatus("Please choose another country! ");
                      }
                  }


                /*
                setStatus("Please press the ENDTURN button to finish your turn");
                clickedTerritoryLayer.setStyle({ weight : 3, color: 'blue', fillColor:'yellow', fillOpacity: 0.7});
                fortifyTerritoryToLayer = clickedTerritoryLayer;
                fortifyTerritoryTo = clickedTerritory;
                var fortifyInfantryHTML = '';

               // getInfantry(lastClickedTerritory);
                for(var i = 1; i < 3; i++){
                  fortifyInfantryHTML += '<option value="vw">'+i+'</option>';
                }

                // <button id="reinforcebutton" type="button" class="btn btn-fortify" onClick="glayer.closePopup()">Fortify</button> </center>
                clickedTerritoryLayer.bindPopup('<center><b>How Many Infantry?</b> <br><br><select>'+fortifyInfantryHTML+'</select><br><br>');
                clickedTerritoryLayer.openPopup();
                clickedTerritoryLayer.unbindPopup();
                //fortifyPhaseStyle();
                fortifyInfantryHTML = '';
                //fortifyFrom = null;
                */

              }
            }

          }

          /*
          if(lastClick && lastClick != glayer)
          { resetHeighlightofNeighBors(lastClickedTerritory); }
          */
             //  highlightNeighbors(clickedTerritory);
           }
           else if(!isGameFinished)
           {
              setStatus("It is not your turn."); // TODO: Add whose turn is now
              console.log("suanda current",currentPlayer);
           }

        }


    // TODO: Server Side FUNCTION NEED TO BE HANDLED
        function fortifyRequest(){
          var fortifyInfartryNumber = element('fortifyinfantrynumber');
          for (var i = 0; i < fortifyInfartryNumber; i++)
          {
            putInfantry(fortifyTerritoryFrom);
          }
        }


        function reinforcePhaseStyle(){
          if(currentPlayer == USER.id)
          {
            if(currentPhase != REINFORCEMENT)
            { currentPhase = REINFORCEMENT; }

            reinforceBtn.style.backgroundColor = '#09821B';
            nextPhaseBtn.disabled = false;
          }
        }

        function attackPhaseStyle(){
          if(currentPlayer == USER.id)
          {
            setStatus("Please select a territory to ATTACK FROM.");
            reinforceBtn.disabled = true;
            attackBtn.style.backgroundColor = '#9E0E15';
          }
        }

        function confirmAttack(){
         resetHeighlightofNeighBors(attackTerritoryFrom);
         resetHighlightTerritory(attackTerritoryFromLayer);
         attackTerritoryToLayer.closePopup();
         attackTerritoryToLayer.unbindPopup();
      //   highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         attackFrom = null;
         isCancelled = true;
         socket.emit('startWar', {attacker: attackTerritoryFrom, defender: attackTerritoryToSave});
          attackTerritoryToSave = null;
          attackTerritoryTo = null;
       }

// Function that makes necessary actions after player cancels the attack
       function cancelAttack(){
         resetHeighlightofNeighBors(attackTerritoryFrom);
         resetHighlightTerritory(attackTerritoryFromLayer);
         attackTerritoryToSave = null;
         attackTerritoryToLayer.closePopup();
         attackTerritoryToLayer.unbindPopup();
         attackTerritoryTo = null;
      //   highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         attackFrom = null;
         isCancelled = true;
       }



    // Function that makes necessary actions after player cancels the fortify action
       function cancelFortify(){
         resetHeighlightofNeighBors(fortifyTerritoryFrom);
         resetHighlightTerritory(fortifyTerritoryFromLayer);
         fortifyTerritoryToSave = null;
         fortifyTerritoryToLayer.closePopup();
         fortifyTerritoryToLayer.unbindPopup();
         fortifyTerritoryTo = null;
      // highlightAttackables(attackTerritoryFrom);
         nextPhaseBtn.disabled = false;
         fortifyFrom = null;
         isCancelled = true;
       }

        function fortifyPhaseStyle(){
          if(currentPlayer == USER.id)
          {

            if(attackTerritoryFromLayer != undefined && attackTerritoryTo != null ){
              resetHighlightTerritory(attackTerritoryFromLayer);
              resetHeighlightofNeighBors(attackTerritoryFrom);
              attackTerritoryFromLayer = undefined;
              attackTerritoryTo = null;
            }

            setStatus("Please select your territory to fortify.");
            attackBtn.disabled = true;
            fortifyBtn.style.backgroundColor = '#FF5900';
            nextPhaseBtn.disabled = false;
            nextPhaseBtn.firstChild.data = "END TURN";
            nextPhaseBtn.style.backgroundColor = "red";
          }
        }

        function resetAttributes(){

            reinforceBtn.style.backgroundColor = '#1642A8';
            attackBtn.style.backgroundColor = '#1642A8';
            fortifyBtn.style.backgroundColor = '#1642A8';
            nextPhaseBtn.style.backgroundColor = '#1642A8';
            reinforceBtn.disabled = false;
            attackBtn.disabled = true;
            fortifyBtn.disabled = true;
            nextPhaseBtn.disabled = true;
            nextPhaseBtn.firstChild.data = "NEXT PHASE";

            if(fortifyTerritoryFromLayer != undefined && fortifyTerritoryTo != null ){
              resetHighlightTerritory(fortifyTerritoryFromLayer);
              resetHeighlightofNeighBors(fortifyTerritoryFrom);
              fortifyTerritoryFromLayer = undefined;
              fortifyTerritoryTo = null;
            }

          //  countriesLayer.resetStyle(lastClickedTerritory);
        }

        function nextPhase(){
            if(currentPhase == REINFORCEMENT)
            {
              currentPhase = ATTACK;
              reinforceBtn.disabled = true;
              attackBtn.disabled = false;
              attackPhaseStyle();
            }
            else if(currentPhase == ATTACK)
            {
              currentPhase = FORTIFY;
              fortifyBtn.disabled = false;
              fortifyPhaseStyle();
            }
            else if(currentPhase == FORTIFY)
            {
              firstTurn = false;
              endTurnStyle();
            }
        }


      // TODO: Did he really played or not? check please
        function endTurnStyle(){
          if(currentPlayer == USER.id)
          {
              socket.emit('endturn', {gameid: gameid, userid: USER.id});
              console.log("ENDTURN CALLED!",USER.id);
              resetAttributes();
              //reinforcePhaseStyle(); /////////////////// CAN BE DELETED!!
              currentPhase = REINFORCEMENT;
              //nextTurn();
          }
        }

        // Gets infantry number of the territory
        function getInfantry(layer)
        {
           return layer.feature.properties.ARMYCOUNT;
        }

        //  feature function
        function highlightFeature(e)
        {
          var layer = e.target;
          layer.setStyle({ weight : 3, color : 'black', fillColor : 'white', fillOpacity : 0.2,});
          if(!L.Browser.ie && !L.Browser.opera)
          { layer.bringToFront(); }
        }

        // Highlighting of a territory
        function highlightTerritory(target)
        {
          var layer = target;
          layer.setStyle({ weight : 3, color : 'black', fillColor : 'white', fillOpacity : 0.2, });
          if(!L.Browser.ie && !L.Browser.opera)
          { layer.bringToFront(); }
        }

        // Reset highlighting of a territory
        function resetHighlightTerritory(target)
        {
          countriesLayer.resetStyle(target);
        }

        // reset hightlight function
        function resetHighlight(e)
        {
          countriesLayer.resetStyle(e.target);
        }

        // zoom to feature
        function zoomToFeature(e)
        {
          // map.fitBounds(e.target.getBounds());
        }

        // Highlighting of a neighbors of a territory with a territoryid
        function highlightNeighbors(tid)
        {
            for(var j = 0; j < territories[tid].neighbors.length; j++){
              highlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
            }
        }

          // checks if the country is enable to attack clicked country first parametre Attacker second one is Defender
        function canAttack(tid,tid1){
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[tid].neighbors[j] == tid1 && territories[territories[tid].neighbors[j]].ownsto != territories[tid].ownsto )
            { return true; }
          }
          return false;
         }

          // checks if the country is enable to attack clicked country first parametre Attacker second one is Defender
        function canFortify(tid, tid1){
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[tid].neighbors[j] == tid1 && territories[territories[tid].neighbors[j]].ownsto == territories[tid].ownsto )
            { return true; }
          }
          return false;
         }

        // Highlights atackable neighbors of clicked country
        function highlightAttackables(tid)// Highlighting of a attackables of a territory with a territoryid
        {
          var attackables = 0;
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[territories[tid].neighbors[j]].ownsto != territories[tid].ownsto)
            {
              highlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
              attackables++;
            }
          }
          return attackables;
        }

        // Highlights Fortifyable neighbors of clicked country
        function highlightFortifyables(tid)// Highlighting of a fortifyable of a territory with a territoryid
        {
          var fortifyables = 0;
          for(var j = 0; j < territories[tid].neighbors.length; j++){
            if(territories[territories[tid].neighbors[j]].ownsto == territories[tid].ownsto)
            {
              fortifyables++;
              highlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
            }
          }

          return fortifyables;
        }

        // Resetting of heighlight of the neighbor of a territory by its territory id
        function resetHeighlightofNeighBors(tid)
        {
            for(var j = 0; j < territories[tid].neighbors.length; j++){
              resetHighlightTerritory(mapTerritories[territories[tid].neighbors[j]]);
            }
        }


      // EKLEDIM
      var counter_asia = 0; // FIRST TURN AND THE OTHERS COUNTERS ADDED
      var counter_south_america = 0;
      var counter_north_america = 0;
      var counter_africa = 0;
      var counter_europe = 0;
      var counter_ocenia = 0;
      var firstTurnInfantries = 0;

    // TODO: Maybe add some delay to organize sockets
        function putInfantry(tid)
        {
          //var ctid = mapTerritories.indexOf(layer);
          // socket.emit('putinfantry', {tid: tid});
          socket.emit('reinforcement', {pid: USER.id, tid: tid});
        }

        function updateMapInfantries(tid, infantry, ownsto){
          var territoryLayer = mapTerritories[tid];
          if(ownsto == 0){
            countryLabel = 'countryLabel0';
          }

          else if (ownsto == 1){
            countryLabel = 'countryLabel1';
          }

          else if(ownsto == 2){
            countryLabel = 'countryLabel2';
          }
          //console.log(territoryLayer);
          map.closeTooltip(territoryLayer.getTooltip()); // Close old tooltip
          territoryLayer.feature.properties.ARMYCOUNT = infantry + 1;
          territoryLayer.bindTooltip((infantry).toString(), {permanent:true,direction:'center',className: countryLabel});
        }

        var element = function(id)
        {
            return document.getElementById(id);
        }

        var messages = element('messages');
        var textarea = element('textarea');

        inputSocketEvents();
        outputSocketEvents();

        function inputSocketEvents(){
          socket.emit('getcurrentplayer', {gameid: 1});
        }

        function Attack() //let server know attacking action
        {
          socket.emit('startWar', {attacker: attackTerritoryFrom, defender: attackTerritoryToSave});
        }


        function outputSocketEvents(){
        // Handle Output Events
            socket.on('updatedterritory', function(data){

              if(data.length)
              {
              if(initialization)
              {
                territories = data;
                initialization = false;
              }
                for (i = 0; i < data.length; i++)
                {
                    updateMapInfantries(data[i].tid, data[i].infantry, data[i].ownsto);
                    territories[data[i].tid] = data[i];
                }
              }
            });

             socket.on('currentplayer', function(data){
              if(data.length > 0)
              {
                console.log("budondu: ",data[0]);
                setTurn(data[0][0].currentplayer);
              }
            });

              // Handle Output Events
            socket.on('allmessages', function(data){
              if(data.length)
              {
                console.log("data buraya geliyor sanirim: ",data);
                for (i = 0; i < data.length; i++)
                {
                  var chatMessage = document.createElement('div');
                  chatMessage.id = 'chatmsgs';
                  var message = document.createElement('div');
                  chatMessage.innerHTML = '';
                  chatMessage.innerHTML = chatMessage.innerHTML + "<b>"+ data[i].name +"</b>: " + data[i].message;
                  messages.append(chatMessage);
                }
              }
              $("#messages").scrollTop($('#messages')[0].scrollHeight);
            });

            socket.on('leftinfantry', function(data){

              if(data.length)
              {
                leftInfantry = data[0].infantry;
                if(currentPlayer == USER.id && data[0].infantry > 0){
                  setStatus("You have "+ data[0].infantry.toString() + " infantry left.");
                }
                else if(currentPlayer == USER.id && data[0].infantry == 0)
                {
                  setStatus("You do not have any infantry left.");
                }
              }
            });

               socket.on('currentplayer', function(data){

              if(data.length)
              {
                for (i = 0; i < data.length; i++)
                {
                    setTurn(data[0][i].currentplayer);
                }
              }
            });

            socket.on('gamefinish', function(data){
              if(data.length)
              { finishGame(data[0].winner); }

            });

        }



      // Style of features
        function finishGame(winner)
        {    
            isGameFinished = true;
            reinforceBtn.disabled = true;
            attackBtn.disabled = true;
            fortifyBtn.disabled = true;
            nextPhaseBtn.disabled = true;

            if(USER.id == winner)
            {
             setStatus("Congratulations you won the game!"); 
            } 
            else
            {
             setStatus("Game over!" + players[winner].name + " has won the game!"); 
            }
        }

        // Country color function
        function getCountryColor(CONTINENT)
        {
          if(CONTINENT == "Asia")
          { return 'orange';  }
          else if(CONTINENT == "Europe")
          { return 'blue'; }
          else if(CONTINENT == "Oceania")
          { return 'green'; }
          else if(CONTINENT == "North America")
          { return 'brown'; }
          else if(CONTINENT == "South America")
          { return 'yellow'; }
          else if(CONTINENT == "Africa")
          { return 'red'; }
        }

      // Style of features
        function countriesStyle(feature)
        {
          return {fillColor : getCountryColor(feature.properties.CONTINENT),
            weight : 2,
            opacity : 1,
            color : 'black',
            dashArray : 3,
            fillOpacity : 0.8
          }
        }

      // Map center and zoom scale
        var map = L.map('map').setView([43.8476, 18.3564], 2);

  /*
        L.Map = L.Map.extend({
          openPopup: function(popup) {
                      // this.closePopup();  // just comment this
              this._popup = popup;
              return this.addLayer(popup).fire('popupopen', {
                  popup: this._popup
              });
          }
        });
  */

        if(maplevel == "hard"){
        countriesLayer = L.geoJson( countries, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);
        }    
        else if(maplevel == "medium"){
          console.log("medium called reis");
        countriesLayer = L.geoJson( countries30, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);
        }
        else {
          countriesLayer = L.geoJson( countries, { style : countriesStyle, onEachFeature : countriesOnEachFeature}).addTo(map);
        }

      // It is used for legends - > We can use it to add control panel or sth else
        var gameStatusLegend = L.control({position : 'topright'});
        var controlPanelLegend = L.control({position : 'bottomright'});

        gameStatusLegend.onAdd = function(map)
        {
          var div = L.DomUtil.create('div','legend');
          div.innerHTML = '<div class="container"><h4><div id="gamestatus">Press end turn to finish the turn.</div></h4></div>';
          return div;
        }

        controlPanelLegend.onAdd = function(map)
        {
          var div = L.DomUtil.create('div','legend');
          div.innerHTML = '<div class="container"><button id="reinforcebutton" type="button" class="btn btn-reinforce btn-lg" onClick="reinforcePhaseStyle()">Reinforce</button> <button id="attackbutton" type="button" class="btn btn-attack btn-lg" disabled>Attack</button> <button id="fortifybutton" type="button" class="btn btn-fortify btn-lg" disabled>Fortify</button> <button id="nextphasebutton" type="button" class="btn btn-fortify btn-lg" onClick ="nextPhase()" disabled>NEXT PHASE</button></div>';
          return div;
        }

        gameStatusLegend.addTo(map);
        controlPanelLegend.addTo(map);

      // HTML PART

              // Get element
              var gameStatus = element('gamestatus');
              //var username = element('username');
              var clearBtn = element('clear');
              var nextPhaseBtn = element('nextphasebutton');
              var reinforceBtn = element('reinforcebutton');
              var attackBtn = element('attackbutton');
              var fortifyBtn = element('fortifybutton');
              var fortifyBtn = element('fortifybutton');


              reinforceBtn = element('reinforcebutton');
              //reinforceBtn.addEventListener('onClick', reinforcePhaseStyle());
              //nextPhaseBtn.addEventListener('onClick', nextPhase());

              // Set default status
              var statusDefault = gameStatus.textContent;

              function setUser(){
                var userid = element('userid').value;
                currentplayer = userid;
                USER = players[userid];
                setStatus("You are: "+ USER.id);
              }
              // Set the status
              var setStatus = function(s){
                gameStatus.textContent = s;
              }



              socket.emit('getmsgs', {gameid: 1});

            if(socket !== undefined)
            {
              console.log("Socket connected to server.");
            }

                // Handle Output Events
                socket.on('outputmsg', function(data){

                    if(data.length)
                    {
                        for (i = 0; i < data.length; i++)
                        {
                            var chatMessage = document.createElement('div');
                            chatMessage.id = 'chatmsgs';
                            var message = document.createElement('div');
                            chatMessage.innerHTML = '';

                            chatMessage.innerHTML = chatMessage.innerHTML + "<b>" +data[i].name +"</b>: " + data[i].message;

                            messages.append(chatMessage);
                            //messages.insertBefore(message, messages.firstChild);
                        }
                    }

                    $("#messages").scrollTop($('#messages')[0].scrollHeight);

                });



            // Get Status from Server
            socket.on('status', function(data){
              // get message status
              //setStatus((typeof data === 'object') ? data.message: data);

              // If status is clear, clear text
              if(data.clear)
              {
                textarea.value = '';
              }
            });


                // Handle Input
                textarea.addEventListener('keydown', function(event){
                    if(event.which === 13 && event.shiftKey == false){ // enter tusu
                        // Emit to server input
                        console.log(textarea.value);
                        socket.emit('newmessage', {
                            gameid: 1,
                            name:USER.name,
                            message:textarea.value
                        });
                        textarea.value = '';
                        event.preventDefault();
                    }
                });


    /*

    these will be on the server side
        function putInfantry(layer)
        { // EKLEDIM
          var continent = layer.feature.properties.CONTINENT;

          if(firstTurn == true)
          {
              if(firstTurnInfantries < 20) // en basta 20  asker koyduğunu düşünürsek
              {
              layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
              firstTurnInfantries = firstTurnInfantries + 1;
              }
          }
          else
          {
            if(continent == "Asia")
            {
              if(counter_asia < 7)
              {
                layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
                counter_asia = counter_asia + 1;
              }
            }
            else if(continent == "Europe")
            {
              if(counter_europe < 5)
              {
                layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
                counter_europe = counter_europe + 1;
              }
            }
            else if(continent == "Africa")
            {
              if(counter_africa < 3)
              {
                layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
                counter_africa = counter_africa + 1;
              }
            }
            else if(continent == "Oceania")
            {
              if(counter_ocenia < 2)
              {
                layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
                counter_ocenia = counter_ocenia + 1;
              }
            }
            else if(continent == "North America")
            {
              if(counter_north_america < 5)
              {
                layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
                counter_north_america = counter_north_america + 1;
              }
            }
            else if(continent == "South America")
            {
              if(counter_south_america < 2)
              {
                layer.feature.properties.ARMYCOUNT = layer.feature.properties.ARMYCOUNT + 1;
                counter_south_america = counter_south_america + 1;
              }
            }
          }

        }

        */
