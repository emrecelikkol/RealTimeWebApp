var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);

users=[];
connections=[];

server.listen(process.env.PORT || 3000);

app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
});


io.sockets.on('connection',function(socket){
    connections.push(socket);
    console.log('Connected : %s sockets connected',connections.length);


    socket.on('disconnect',function(data){
        connections.splice(connections.indexOf(socket));
        console.log('Disconnected: %s sockets connected',connections.length);
    });
    socket.on('send message', function(data){
        console.log(data);
        io.sockets.emit('new message',{msg:data});
    });

    socket.on('new user', function(userName,callback){
        console.log("new user send name");
        socket.userName=userName;
        users.push(userName);
        callback({"success":true,"userList":users});
        io.sockets.emit('get users',{"userList":users});
    })

});