var express = require('express');
var app = express();
app.set('view engine', 'ejs');
var server = app.listen(3000, function(){
	console.log('\nServer has started on Port 3000. Time:', currentTime);
});

var io = require('socket.io').listen(server);
var router = require('./router')(app,io);

var path = require('path');
var bodyParser = require('body-parser');

// Bodyparser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(router);

var date = new Date();
var currentTime = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
