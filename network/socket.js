exports.success = function (
  room,
  socketId,
  module,
  message,
  status,
  currentSocket,
  globalSocket,
) {
  const channel = `${module.replaceAll('/', '')}:success`;

  if (socketId) {
    globalSocket.to(socketId).emit(channel, {
      status: status || 200,
      error: '',
      body: message,
    });
  } else {
    currentSocket.emit(channel, {
      status: status || 200,
      error: '',
      body: message,
    });
  }
};

exports.error = function (
  room,
  socketId,
  module,
  message,
  status,
  details,
  currentSocket,
  globalSocket,
) {
  const channel = `${module.replaceAll('/', '')}:error`;

  console.error(`[response error] ${details}, channel: ${channel}`);

  if (message === 'Login is necessary') {
    if (socketId) {
      globalSocket.to(socketId).emit(channel, {
        status: status || 500,
        error: message,
        loginIsRequired: true,
        body: '',
      });
    } else {
      currentSocket.emit(channel, {
        status: status || 500,
        error: message,
        loginIsRequired: true,
        body: '',
      });
    }
  }
  if (details && message !== 'Login is necessary') {
    if (socketId) {
      globalSocket.to(socketId).emit(channel, {
        status: status || 500,
        error: message,
        body: '',
      });
    } else {
      currentSocket.emit(channel, {
        status: status || 500,
        error: message,
        body: '',
      });
    }
  } else {
    console.error(`[response error] Impossible recovery error`);
  }
};
