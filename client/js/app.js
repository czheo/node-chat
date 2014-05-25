var $ = require("jquery"),
    B = require("backbone");
B.$ = $;
var LoginView = require("./LoginView");
var ChatView = require("./ChatView");
var vent = require("./vent");

var AppView = B.View.extend({
    el : $("#wrapper"),
    initialize : function(){
        this.render();
        this.listenTo(vent, "login", this.renderChat);
        this.listenTo(vent, "logout", this.renderLogin);
    },
    render : function() {
        this.renderLogin();
    },
    renderLogin : function(){
        if(this.chatView) this.chatView.tearDown();
        this.loginView = new LoginView();
        this.$el.html(this.loginView.$el);
        this.loginView.$("#input-name").focus();
    },
    renderChat : function(data) {
        if(this.loginView) this.loginView.tearDown();
        this.chatView = new ChatView(data);
        this.$el.html(this.chatView.$el);
    }
});

$(function(){
    var app = new AppView();
});
