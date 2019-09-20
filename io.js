const sio = require('socket.io');

let io = null;

exports.io = function() {
    return io;
};

exports.initialize = function(server) {
    io = sio(server);
    io.on('connection', (socket) => {
        console.log(`A user connected with ${socket.id}`);

        io.on('disconnect', () => {
            console.log(`A user disconnected with ${socket.id}`);
        });
    });
};

