require('express');
const { rootRoutes } = require('../utils');
const invoice = require('../components/invoice/network');
const users = require('../components/users/network');
const userTypes = require('../components/userTypes/network');
const companies = require('../components/companies/network');

const { usersPath, userTypesPath, invoicesPath, companiesPath } = rootRoutes;

const routes = function (server) {
  server.use(usersPath, users);
  server.use(userTypesPath, userTypes);
  server.use(invoicesPath, invoice);
  server.use(companiesPath, companies);
};

module.exports = routes;
