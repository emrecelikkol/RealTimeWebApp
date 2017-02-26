var express=require('express');
var app=express();
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
var validator=require('validator');

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
        if(socket.userName){
            users.splice(users.indexOf(socket));
            io.sockets.emit('get users',{"userList":users});
        }

        connections.splice(connections.indexOf(socket));
        console.log('Disconnected: %s sockets connected',connections.length);
    });
    socket.on('send message', function(data){
        console.log(data);
        data=validator.escape(data);
        data=socket.userName+" : "+data;
        io.sockets.emit('new message',{msg:data});
    });

    socket.on('new user', function(userName,callback){
        console.log("new user send name");
        userName=validator.escape(userName);
        socket.userName=userName;
        users.push(userName);
        callback({"success":true,"userList":users});
        io.sockets.emit('get users',{"userList":users});
    })

});
