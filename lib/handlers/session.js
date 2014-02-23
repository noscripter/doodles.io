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

  login: function (req, res, next) {
    passport.authenticate('local', function (err, doc) {
      if (err) {
        return res.json({
          success: false,
          error: err
        });
      }
      if (doc) {
        return req.login(doc, {}, function(err) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          return res.json({
            success: true,
            data: doc
          });
        });
      }
      return res.json({
        success: false,
        error: 'Incorrect login details.'
      });
    })(req, res, next);
  },

  logout: function (req, res, next) {
    if (req.isAuthenticated()) {
      req.logout();
    }
    return res.redirect('/');
  },

  authenticate: function (id, password, callback) {
    return user.getByUsernameOrEmail(id, function (err, doc) {
      if (err) {
        return callback(err);
      }
      if (doc) {
        return utils.comparePassword(password, doc.password, function (err, result) {
          if (err) {
            return callback(err);
          }
          if (result) {
            return callback(null, doc);
          }
          return callback(null, null);
        });
      }
      return callback(null, null);
    });
  },

  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    return res.redirect('/login');
  },

}