//Server for the online gaming

var express = require('express');
var xml2json = new require('node-xml2json');
var redis = new require('redis');
var app = express();
var io = require('socket.io').listen(81);

console.log("IO listening on port 81");
app.listen(8080);



io.sockets.on('connection', function (client) {
  console.log("Client connected...");
  client.on('join', function(name) {
	client.username = name;
	console.log("Connect user: " + client.username);
	client.emit('loginSuccess', function(){});
	
	//client.emit('orderToClient', { hello: 'Hello!'});
	//client.emit('orderToClient', {row: 2, col: 1, row_p: 0, col_p: 2}, function(err, data){});
	
  });
  
  client.on('orderFromClient', function(order){
	console.log("Received new move from " + client.username);
	console.log(order);
	client.broadcast.emit('orderToClient', order);
  });
  
 
  client.on('disconnect', function () {
    console.log("Client disconnected...");
	console.log("Disconnect user: " + client.username);

  });

});
