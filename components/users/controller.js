const store = require('./store');

function addUser(user) {
  if (!user) {
    return Promise.reject(`User data is empty. User: ${JSON.stringify(user)}`);
  }

  return store.add(user);
}

function login(req, res, next) {
  return store.login(req, res, next);
}

function logout(req) {
  return store.logout(req);
}

function listUsers(userId, companyId) {
  return store.list(userId, companyId);
}

function updateUser(userId, user) {
  if (!userId || !user) {
    return Promise.reject(
      `userId or user is undefined. userId is: ${userId}, user is: ${JSON.stringify(
        user,
      )}`,
    );
  }
  return store.update(userId, user);
}

function removeUser(userId) {
  if (!userId) {
    return Promise.reject('userId is undefined');
  }
  return store.remove(userId);
}

function profile(req) {
  if (!req.user) {
    return Promise.reject('Login is necessary');
  }
  return Promise.resolve(listUsers(req.user._id, req.user.company));
}

module.exports = {
  addUser,
  listUsers,
  updateUser,
  removeUser,
  login,
  logout,
  profile,
};
