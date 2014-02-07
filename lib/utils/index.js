var bcrypt = require('bcrypt');

module.exports = {
  
  hashPassword: function (password, callback) {
    bcrypt.genSalt(10, function(saltErr, salt) {
      if (saltErr)
        return callback(saltErr);
      bcrypt.hash(password, salt, function(hashErr, hash) {
        if (hashErr)
          return callback(hashErr);
        return callback(null, hash);
      });
    });
  },
  
  comparePassword: function (password, hash, callback) {
    bcrypt.compare(password, hash, function(err, res) {
      if (err)
        return callback(err);
      return callback(err, res);
    });
  },

  toSlug: function (value) {
    return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }
  
}