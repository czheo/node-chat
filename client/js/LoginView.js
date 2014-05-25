var $ = require("jquery"),
    B = require("backbone");
B.$ = $;
var template = require("./templates/login.html");
var vent = require("./vent");

var LoginView = B.View.extend({
    id : "login",
    events: {
        "keypress #input-name": "onKeyPress",
        "click #button-login": "login",
    },
    initialize : function() {
        this.render();
    },

    render: function() {
        this.$el.html(template());
    },

    onKeyPress: function(e) {
        if(e.which == 13) {
            this.login();
        }
    },

    login: function(){
        var $input = this.$("#input-name");
        var username = $.trim($input.val());
        if (username) {
            vent.trigger("login", {username: username});
        }
        $input.val("");
        return false;
    },
    tearDown: function() {
        this.off();
        this.remove();
    }
});

module.exports = LoginView;
