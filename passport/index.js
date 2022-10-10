const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('../components/users/model');
const response = require('../network');

passport.serializeUser((usuario, done) => {
  // eslint-disable-next-line no-underscore-dangle
  done(null, usuario._id);
});

passport.deserializeUser((id, done) => {
  Users.findById(id, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: 'userName' },
    (userName, password, done) => {
      Users.findOne({ userName }, (err, user) => {
        console.log(err);
        if (!user) {
          done(null, false, { message: 'username is no register' });
        } else {
          Users.schema.methods.checkPassword(
            password,
            user.password,
            (error, isSame) => {
              if (isSame) {
                done(null, user);
              } else {
                done(error, false, { message: 'Invalid password' });
              }
            },
          );
        }
      });
    },
  ),
);

exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    response.error(req, res, 'Login is necessary', 500, 'Login necesario');
  }
};
