exports.success = function (req, res, message, status, isImage) {
  if (isImage) {
    res.status(status || 200).send(message);
  } else {
    res.status(status || 200).send({
      error: '',
      body: message,
    });
  }
};

exports.error = function (req, res, message, status, details) {
  console.error(`[response error] ${details}`);
  if (message === 'Login is necessary') {
    res.status(status || 500).send({
      error: message,
      loginIsRequired: true,
      body: '',
    });
    return null;
  }
  if (details) {
    res.status(status || 500).send({
      error: message,
      body: '',
    });
    return null;
  }
  console.error(`[response error] Impossible recovery error`);
  return null;
};
