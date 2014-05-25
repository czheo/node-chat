var $ = require("jquery"),
    B = require("backbone");
B.$ = $;
var sio = require("./sio");
var vent = require("./vent");

var ChatModel = B.Model.extend({
    initialize: function(data){
        var socket = this.socket = sio.connect();
        var self = this;
        socket.on("connect", function(){
            socket.emit("login", self.get("username"));
        });

        socket.on("ready", function(username){
            self.set("username", username);
            socket.on("message", function(data){
                self.set("new_msg", data);
            });
            socket.on("room", function(room){
                self.set("room", room);
            });
            socket.on("updateMember", function(data){
                self.set("members", data);
            });
            socket.on("loadMessage", function(data){
                self.set("messages", data);
            });
            self.set("ready", true);
            self.switchRoom("hall");
        });

        socket.on("disconnect", function(){
            vent.trigger("logout");
        });
    },
    sendMessage: function(message) {
        this.socket.emit("message", message);
    },
    switchRoom: function(room) {
        this.socket.emit("room", room);
    },
    tearDown: function() {
        this.socket.emit("room", "_leave");
        this.socket.disconnect();
        this.socket.removeAllListeners("connect");
        this.socket.removeAllListeners("ready");
        this.socket.removeAllListeners("room");
        this.socket.removeAllListeners("message");
        this.socket.removeAllListeners("disconnect");
        this.socket.removeAllListeners("updateMember");
        this.socket.removeAllListeners("loadMessage");
    }
});

module.exports = ChatModel;
