//Server for the online gaming

var express = require('express');
//var parser = new require('xml2json');
var app = express();
var io = require('socket.io').listen(81);

console.log("IO listening on port 81");
app.listen(8080);



io.sockets.on('connection', function (client) {
  console.log("Client connected...");
  //client.emit('messages', { hello: 'world' });
  
  var order= {row: 0, col: 0, row_p: 0, col_p: 0};
  //var json = parser.toJson(move);
  client.emit('orderToClient', order);
  
  setTimeout(function(){
	var order= {row: 2, col: 0, row_p: 0, col_p: 0};
	//var json = parser.toJson(move);
	client.emit('orderToClient', order);
  }, 5000);
  
  client.on('disconnect', function () {
    console.log("Client disconnected...");
  });
  
  client.on('orderFromClient', function(){
	
  });
});
