var sio = require("socket.io");
var crypto = require('crypto');
var validator = require('validator');
var redis = require("./redis");

module.exports.listen = function(app) {
    var io = sio.listen(app);
    var getMembers = function(room){
        var users = [];
        var socks = io.sockets.clients(room);
        for (var i=0;i<socks.length;i++){
            users.push(socks[i].username);
        }
        return users;
    };

    var getHash = function(ip) {
        var md5sum = crypto.createHash('md5');
        var hash = md5sum.update(ip).digest("hex").substring(0,6);
        return hash;
    };

    io.sockets.on('connection', function (socket) {
        socket.hash = getHash(socket.handshake.address.address);
        socket.on('room', function(room) {
            // leaving room
            if(socket.room) {
                socket.leave(socket.room);
                io.sockets.in(socket.room).emit("updateMember", getMembers(socket.room));
            }
            // enter room
            socket.room = room;
            socket.join(room);
            socket.emit("room", room);
            io.sockets.in(socket.room).emit("updateMember", getMembers(socket.room));

            // get message
            redis.lrange("message:" + room, 0, 50, function(err, items) {
                if(err) {
                    console.log(err);
                    return false;
                }
                var messageList = [];
                items.forEach(function(item){
                    item = JSON.parse(item);
                    if(item.ip) {
                        item.hash = getHash(item.ip);
                    }
                    delete item.ip;
                    messageList.push(item);
                });
                socket.emit("loadMessage", messageList);
                return;
            });
        });
        socket.on("message", function(message){
            message = validator.trim(message);
            message = validator.escape(message);
            if (validator.isLength(message, 1, 512)) {
                var data = {};
                data.message = message;
                data.username = socket.username;
                data.hash = socket.hash;
                data.time = new Date().getTime();
                io.sockets.in(socket.room).emit("message", data);
                data.ip = socket.handshake.address.address;
                redis.lpush("message:" + socket.room, [JSON.stringify(data)], function(err, res){
                    if(err) console.log(err);
                    return;
                });    
            }
        });
        socket.on("login", function(username){
            username = validator.trim(username);            
            username = validator.escape(username);
            if(validator.isLength(username, 1, 12)) {
                socket.username = username;
                socket.emit("ready", username);
            } else {
                socket.disconnect();
            }
        });
    });
    return io;
};
