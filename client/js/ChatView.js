var $ = require("jquery"),
    moment = require("moment"),
    B = require("backbone");
B.$ = $;
var template = require("./templates/chat.html");
var vent = require("./vent");
var ChatModel = require("./ChatModel");

var urlMatcher = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;
var imgMatcher = /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)(\.jpge?|\.png|\.gif))/gi;

var ChatView = B.View.extend({
    id:"#chat",
    events : {
        "keypress #input-message": "onKeyPress",
        "click #button-submit": "sendMessage",
        "click li.room-item": "switchRoom",
        "click #logout": "tearDown",
        "click li.user-item": "replyTo",
        "click .msg-name": "replyTo",
    },
    initialize: function(data) {
        var self = this;
        this.model = new ChatModel(data);
        this.listenTo(this.model, "change:ready", function(){
            self.render({username:this.model.get("username")});
        });
        this.listenTo(this.model, "change:new_msg", function(){
            self.addMessage(self.model.get("new_msg"));
        });
        this.listenTo(this.model, "change:room", function(){
            var room = self.model.get("room");
            self.onRoomChange(room);
        });
        this.listenTo(this.model, "change:members", function(){
            var members = self.model.get("members");
            self.updateMember(members);
        });
        this.listenTo(this.model, "change:messages", function(){
            var messages = self.model.get("messages");
            self.$("#message").empty();
            messages.reverse().forEach(function(message){
                self.addMessage(message);
            });
        });
    },
    render : function(data) {
        this.$el.html(template(data));
        this.$("#input-message").focus();
    },
    addMessage: function(data) {
        var message = data.message;
        var images = message.match(imgMatcher);
        message = message.replace(urlMatcher, '<a target="_blank" href="' + '$1' + '">$1</a>');
        if(images) {
            for(var i=0;i<images.length;i++) {
                var html = '<br><img height="100px" src="' + images[i] + '"/>';
                message += html;
            }
        }
        var msg_html = '<p class="msg">' + 
            '<span class="msg-time">'+ moment(data.time).format("HH:mm:ss")+ '</span>' +
            '[<span class="msg-name" style="color:#' + data.hash + '">'+ data.username + '</span>]' +
            '<span class="msg-text">'+ message + '</span>' +
            '</p>';
        var $message = this.$("#message");
        $message.append(msg_html).scrollTop($message[0].scrollHeight);
    },
    onKeyPress: function(e) {
        if(e.which == 13) {
            this.sendMessage();
        }
    },
    sendMessage: function() {
        var $input = this.$("#input-message");
        var message = $.trim($input.val());
        $input.val("");
        if(message) {
            this.model.sendMessage(message);
        }
    },
    switchRoom: function(e) {
        var room = $(e.target).text();
        this.model.switchRoom(room);
    },
    updateMember: function(members) {
        var $userList = this.$("#user-list");
        $userList.empty();   
        for(var i=0;i<members.length;i++) {
            var html = '<li class="user-item">' + members[i]+'</li>';
            $userList.append(html);
        }
    },
    replyTo: function(e){
        var user = $(e.target).text();
        var $input = this.$("#input-message");
        var newmsg = "@"+user+ " "+ $input.val();
        $input.val(newmsg);
        $input.focus();
    },
    onRoomChange: function(room) {
        this.$("li.room-item").removeClass("selected");
        this.$("#room-item-" + room).addClass("selected");
    },
    tearDown : function() {
        this.model.tearDown();
        this.stopListening();
        this.off();
        this.remove();
    }
});

module.exports = ChatView;
