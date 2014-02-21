var db = require('../db');
var utils = require('../utils');
var validate = require('../utils/validate');
var user = module.exports = {
  
  register: function (req, res, next) {
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;

    return user.exists({
      username: username,
      email: email
    }, function (err, exists) {
      if (err) {
        return registrationFailed('An error has occured. Please try again. (' + err + ')');
      }
      if (exists) {
        return registrationFailed('A user with the same username or email address you provided already exists.');
      }
      return user.create({
        email: email,
        username: username,
        password: password
      }, function (err, user) {
        req.login(user, function (err) {
          if (err) {
            return next(err);
          }
          return res.redirect('/');
        });
      });
    });
    
    function registrationFailed(message) {
      return console.log(message);
    }
  },

  create: function (params, callback) {
    return utils.hashPassword(params.password, function (err, hash) {
      if (err) {
        return console.log('Failed to hash password', err);
      }
      return db.user.add({
        email: params.email.toLowerCase(),
        username: params.username,
        password: hash
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