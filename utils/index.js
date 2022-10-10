const MongoStore = require('connect-mongo');
const session = require('express-session');
const response = require('../network/socket');

require('dotenv').config();

const sessionMiddleware = session({
  secret: process.env.SECRET_KEY_SESSION,
  resave: true,
  name: 'scanner-blackservices',
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONECTION_DEV,
    stringify: false,
  }),
});

const rootRoutes = {
  invoicesPath: '/invoice',
  usersPath: '/users',
  userTypesPath: '/userTypes',
  companiesPath: '/companies',
};

const usersPath = {
  listUsers: `${rootRoutes.usersPath}/`,
};

const executeWithAuth = (socket, cb) => {
  if (socket.request.user) {
    cb();
  } else {
    response.error(
      '',
      '',
      rootRoutes.usersPath,
      'Login is necessary',
      500,
      'Login is necessary',
      socket,
    );
  }
};

const isValidQuery = (socket, next, currentSocket, globalSocket) => {
  const data = socket?.[1]?.method || null;
  if (data) {
    next();
  } else {
    const { id } = currentSocket;
    response.error(
      '',
      id,
      rootRoutes.usersPath,
      'fields missing',
      500,
      'method undefined',
      currentSocket,
      globalSocket,
    );
  }
};

module.exports = {
  sessionMiddleware,
  rootRoutes,
  usersPath,
  executeWithAuth,
  isValidQuery,
};
