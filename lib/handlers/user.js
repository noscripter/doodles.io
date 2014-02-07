var db = require('../db'),
    utils = require('../utils'),
    validate = require('../utils/validate');

var user = module.exports = {
  
  register: function (req, res, next) {
    var email = req.body.email,
        username = req.body.username,
        password = req.body.password;
      
    if (!validate.presence([email, username, password]))
      return registrationFailed('Please fill in all required fields.');
    if (!validate.email(email))
      return registrationFailed('Please provide a valid email address.');
    if (!validate.username(username))
      return registrationFailed('Please provide a valid username.');
    if (username.length < 3)
      return registrationFailed('Your username must be at least 3 characters long.');
    if (password.length < 4)
      return registrationFailed('Your password must be at least 4 characters long.');
    
    // Check to see if a user already exists with the same username or email address.
    user.exists({
      username: username,
      email: email
    }, function (err, exists) {
      if (err)
        return registrationFailed('An error has occured. Please try again. (' + err + ')');
      if (exists)
        return registrationFailed('A user with the same username or email address you provided already exists.');
      // Register the new user.
      user.create({
        email: email,
        username: username,
        password: password
      }, function (err, user) {
        // Log the user in after registration.
        req.login(user, function (err) {
          if (err)
            return next(err);
          return res.redirect('/');
        });
      });
    });
    
    function registrationFailed(message) {
      console.log(message);
    }
  },

  create: function (params, callback) {
    // Encrypt the password.
    utils.hashPassword(params.password, function (err, hash) {
      if (err)
        return console.log('Failed to hash password', err);
      db.user.add({
        email: params.email.toLowerCase(),
        username: params.username,
        password: hash
      }, function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, null);
      });
    });
  },

  exists: function (params, callback) {
    if (params.username)
      params.username.toLowerCase();
    if (params.email)
      params.email.toLowerCase();
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
      // Check the user exists within the db.
      db.user.exists(query, function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, false);
      });
    } else {
      callback(null, null);
    }
  },

  getByUsernameOrEmail: function (id, callback) {
    if (id.match(/@/))
      return db.user.getByEmail(id.toLowerCase(), callback);
    return db.user.getByUsername(id.toLowerCase(), callback);
  },

  get: function (req, res, next) {
    var username = req.params.username.toLowerCase();
    db.user.getByUsername(username, function userCb(err, doc) {
      if (err)
        return next(err);
      if (!doc) {
        // render.notFound();
      } else {
        req.userDoc = doc;
        return next();
      }
    });
  }

}