var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user = require('./user');
var utils = require('../utils');
var db = require('../db');
var session = module.exports = {

  init: function () {
    passport.use(new LocalStrategy({
        usernameField: 'id'
      },
      function (id, password, done) {
        return session.authenticate(id, password, function (err, doc) {
          if (err) {
            return done(err);
          }
          if (doc) {
            return done(null, doc);
          }
          return done(null, null);
        });
      }
    ));

    passport.serializeUser(function (user, done) {
      return done(null, user._id);
    });

    passport.deserializeUser(function (_id, done) {
      return db.user.getById(db.toObjectId(_id), function (err, doc) {
        if (err) {
          return done(err);
        }
        if (doc) {
          return done(null, doc);
        }
        return done(null, null);
      });
    });
  },

  logout: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.logout();
    }
    return res.redirect('/');
  },

  authenticate: function (id, password, callback) {
    return user.getByUsernameOrEmail(id, function userFound(err, doc) {
      if (err) {
        return console.log(err);
      }
      if (doc) {
        return utils.comparePassword(password, doc.password, function userAuthenticated(err, result) {
          if (err) {
            return callback(err);
          }
          if (result) {
            return callback(null, doc);
          }
          return callback(null, null);
        });
      } else {
        return console.log('User not found.');
      }
    });
  },

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  },

}