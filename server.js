var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require("socket.io").listen(server);

users = [];
connections = [];

server.listen(3000);

app.get("/",function(req,res){
	res.sendFile(__dirname + '/index.html');
});

console.log("server running");

//defining events and logic associated with them while the socket is connected
io.sockets.on('connection',function(socket){

	//on new connection, add it to the connections array
	connections.push(socket);
	console.log("Connected %s sockets connected",connections.length);
	
	//Disconnect event, removing from connections array
	socket.on('disconnect',function(data){
		connections.splice(connections.indexOf(socket),1);
		idx = users.indexOf(socket.username);
		users.splice(idx,1);
		updateUserNames();
		console.log("Disconnected : %s sockets connected",connections.length);
	});

	//submitted message from front end messageForm
	socket.on('send message',function(data,user){
		io.sockets.emit('new message',{msg : data,username : user});
	});

	socket.on('new user',function(data,callback){
		callback(true);
		socket.username = data;
		users.push(data);
		updateUserNames();
	});

	function updateUserNames(){
		io.sockets.emit("get users",users);
	}

});