var db = require('../db');
var utils = require('../utils');
var validate = require('../utils/validate');
var user = module.exports = {
  
  register: function (req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;

    return user.validate({
      username: username,
      email: email,
      password: password
    }, function (err) {
      if (err) {
        return res.json({
          success: false,
          error: err
        });
      }
      return user.exists({
        username: username,
        email: email
      }, function (err, exists) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        if (exists) {
          return res.json({
            success: false,
            error: 'A user with this username or email address already exists.'
          });
        }
        return user.create({
          username: username,
          email: email,
          password: password
        }, function (err, user) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          if (user) {
            return req.login(user, function (err) {
              if (err) {
                return res.json({
                  success: false,
                  error: err
                });
              }
              return res.json({
                success: true,
                data: user
              });
            });
          }
          return res.json({
            success: false,
            error: 'An unknown error occurred. Please try again.'
          });
        });
      });
    });
  },

  validate: function (params, callback) {
    var username = params.username;
    var email = params.email;
    var password = params.password;

    if (!validate.presence([username, email, password])) {
      return callback('Please fill in all fields.');
    }
    if (!validate.username(username)) {
      return callback('Please provide a valid username.');
    }
    if (username.length < 3) {
      return callback('Your username must be at least 3 characters long.');
    }
    if (!validate.email(email)) {
      return callback('Please provide a valid email address.');
    }
    if (password.length < 6) {
      return callback('Your password must be at least 6 characters long.');
    }
    return callback(null);
  },

  create: function (params, callback) {
    return utils.hashPassword(params.password, function (err, password) {
      if (err) {
        return callback(err);
      }
      return db.user.add({
        username: params.username,
        email: params.email.toLowerCase(),
        password: password
      }, function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    });
  },

  exists: function (params, callback) {
    if (params.username) {
      params.username.toLowerCase();
    }
    if (params.email) {
      params.email.toLowerCase();
    }
    if (params.username || params.email || params._id) {
      var query = { 
        $or: [{ 
          'username': params.username
        }, { 
          'email': params.email
        }, {
          '_id': params._id
        }]
      };

      return db.user.exists(query, function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, false);
      });
    } else {
      return callback(null, null);
    }
  },

  getByUsernameOrEmail: function (id, callback) {
    if (id.match(/@/)) {
      return db.user.getByEmail(id.toLowerCase(), callback);
    }
    return db.user.getByUsername(id.toLowerCase(), callback);
  },

  get: function (req, res, next) {
    var username = req.params.username.toLowerCase();
    
    return db.user.getByUsername(username, function (err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        // return render.notFound();
      } else {
        req.userDoc = doc;
        return next();
      }
    });
  }

}