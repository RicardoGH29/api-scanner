const socketUsers = require('./users');

const initialSocket = function (io) {
  io.on('connection', socket => {
    console.log(socket.request.user);
    socket.emit('conexion:success', 'success conexion');
    const { session } = socket.request;
    console.log(session.socketId);
    console.log(`saving sid ${socket.id} in session ${session.id}`);
    session.socketId = socket.id;
    session.save();
  });
};

module.exports = {
  initialSocket,
};
