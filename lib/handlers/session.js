var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    user = require('./user'),
    utils = require('../utils'),
    db = require('../db'),
    config = require('../config');

var session = module.exports = {

  init: function () {
    passport.use(new LocalStrategy({
        usernameField: 'id'
      },
      function(id, password, done) {
        session.authenticate(id, password, function (err, doc) {
          if (err)
            return done(err);
          if (doc)
            return done(null, doc);
          return done(null, null);
        });
      }
    ));

    passport.serializeUser(function(user, done) {
      done(null, user._id);
    });

    passport.deserializeUser(function(_id, done) {
      db.user.getById(db.toObjectId(_id), function (err, doc) {
        if (err)
          return done(err);
        if (doc)
          return done(null, doc);
        return done(null, null);
      });
    });
  },

  logout: function (req, res, next) {
    if (req.isAuthenticated())
      req.logout();
    res.redirect(config.baseUrl);
  },

  authenticate: function (id, password, callback) {
    user.getByUsernameOrEmail(id, function userFound(err, doc) {
      if (err)
        return console.log(err);
      if (doc) {
        utils.comparePassword(password, doc.password, function userAuthenticated(err, result) {
          if (err)
            return callback(err);
          if (result)
            return callback(null, doc);
          return callback(null, null);
        });
      } else {
        return console.log('User not found.');
      }
    });
  },

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated())
      return next();
    res.redirect('/admin/login');
  },

}