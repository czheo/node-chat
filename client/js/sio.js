var sio = {};

sio.connect = function () {
    if(this.socket) {
        this.socket.socket.connect();
    } else {
        this.socket = io.connect(window.location.origin);
    }
    return this.socket;
};

sio.disconnect = function() {
    this.socket.disconnect();
};

module.exports = sio;
