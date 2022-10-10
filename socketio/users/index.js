require('express');
const response = require('../../network/socket');
const controller = require('../../components/users/controller');
const Helper = require('../../helpers');
const { rootRoutes, executeWithAuth, isValidQuery } = require('../../utils');

const addUser = function (args) {
  const { req, currentSocket, body } = args;
  const user = body;
  const companyId = Helper.getCompanyId(req);
  user.companyId = companyId;
  controller
    .addUser(user)
    .then(data => {
      response.success(
        null,
        null,
        rootRoutes.usersPath,
        data,
        201,
        currentSocket,
      );
    })
    .catch(err => {
      response.error(
        null,
        null,
        rootRoutes.usersPath,
        'Internal Error',
        500,
        err,
        currentSocket,
      );
    });
};

const login = function (args) {
  const { req, res, currentSocket, next } = args;
  controller
    .login(req, res, next)
    .then(data => {
      response.success(
        null,
        null,
        rootRoutes.usersPath,
        data,
        201,
        currentSocket,
      );
    })
    .catch(err => {
      response.error(
        null,
        null,
        rootRoutes.usersPath,
        'Internal Error',
        401,
        err,
        currentSocket,
      );
    });
};

const logout = function (args) {
  const { req, currentSocket } = args;
  controller
    .logout(req)
    .then(data => {
      response.success(
        null,
        null,
        rootRoutes.usersPath,
        data,
        201,
        currentSocket,
      );
    })
    .catch(err => {
      response.error(
        null,
        null,
        rootRoutes.usersPath,
        'Internal Error',
        500,
        err,
        currentSocket,
      );
    });
};

const listUsers = function (args) {
  const { req, currentSocket, body } = args;
  const { userId } = body;
  const companyId = Helper.getCompanyId(req);
  controller
    .listUsers(userId, companyId)
    .then(data => {
      response.success(
        null,
        null,
        rootRoutes.usersPath,
        data,
        201,
        currentSocket,
      );
    })
    .catch(err => {
      response.error(
        null,
        null,
        rootRoutes.usersPath,
        'Internal Error',
        500,
        err,
        currentSocket,
      );
    });
};

const updateUser = function (args) {
  const { req, currentSocket, body } = args;
  const { userId } = body;
  const user = body;
  const companyId = Helper.getCompanyId(req);
  user.companyId = companyId;
  controller
    .updateUser(userId, user)
    .then(data => {
      response.success(
        null,
        null,
        rootRoutes.usersPath,
        data,
        201,
        currentSocket,
      );
    })
    .catch(err => {
      response.error(
        null,
        null,
        rootRoutes.usersPath,
        'Internal Error',
        500,
        err,
        currentSocket,
      );
    });
};

const removeUser = function (args) {
  const { currentSocket, body } = args;
  const { userId } = body;
  controller
    .removeUser(userId)
    .then(data => {
      response.success(
        null,
        null,
        rootRoutes.usersPath,
        data,
        201,
        currentSocket,
      );
    })
    .catch(err => {
      response.error(
        null,
        null,
        rootRoutes.usersPath,
        'Internal Error',
        500,
        err,
        currentSocket,
      );
    });
};

const socketUsers = function (currentSocket, globalSocket) {
  const userPath = rootRoutes.usersPath.replaceAll('/', '-');

  currentSocket.use((socket, next) =>
    isValidQuery(socket, next, currentSocket, globalSocket),
  );

  currentSocket.on(`${userPath}`, data => {
    const req = currentSocket.request;
    const args = { req, currentSocket, body: data };
    const method = (data.method || '').toLowerCase();

    if (method === 'get') {
      executeWithAuth(currentSocket, () => listUsers(args));
    }
    if (method === 'post') {
      executeWithAuth(currentSocket, addUser(args));
    }
    if (method === 'patch') {
      executeWithAuth(currentSocket, updateUser(args));
    }
    if (method === 'delete') {
      executeWithAuth(currentSocket, removeUser(args));
    }
  });

  currentSocket.on(`${userPath}-login`, data => {
    const req = currentSocket.request;
    const method = (data.method || '').toLowerCase();
    if (method === 'post') {
      login({ req, currentSocket, body: data });
    }
  });

  currentSocket.on(`${userPath}-logout`, data => {
    const req = currentSocket.request;
    const method = (data.method || '').toLowerCase();
    if (method === 'post') {
      executeWithAuth(
        currentSocket,
        logout({ req, currentSocket, body: data }),
      );
    }
  });
};

module.exports = socketUsers;
