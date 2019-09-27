const sio = require('socket.io');
const debug = require('debug')('io');

let io = null;

exports.io = function() {
    return io;
};

exports.initialize = function(server) {
    io = sio(server);
    io.on('connection', (socket) => {
        debug(`A user connected with ${socket.id}`);

        io.on('disconnect', () => {
            debug(`A user disconnected with ${socket.id}`);
        });
    });
};

