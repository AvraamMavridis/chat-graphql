var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

let usersOnline = [];

io.on('connection', function(client){

  client.on('disconnect', function() {
    client.emit('connectedUsers', { users: Object.keys(io.sockets.sockets) });
  });

  client.on('registerUser', function(data){
    usersOnline.push(data.username);
    client.emit('userRegistered', { usersOnline });
  })


  client.on('userUnRegistered', function(data){
    usersOnline = usersOnline.filter(user => user !== data.username)
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});