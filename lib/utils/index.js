var bcrypt = require('bcrypt');
var utils = module.exports = {

  hashPassword: function (password, callback) {
    return bcrypt.genSalt(10, function (saltErr, salt) {
      if (saltErr) {
        return callback(saltErr);
      }
      return bcrypt.hash(password, salt, function (hashErr, hash) {
        if (hashErr) {
          return callback(hashErr);
        }
        return callback(null, hash);
      });
    });
  },

  comparePassword: function (password, hash, callback) {
    return bcrypt.compare(password, hash, function (err, res) {
      if (err) {
        return callback(err);
      }
      return callback(err, res);
    });
  },

  toSlug: function (value) {
    return value.toLowerCase().replace(/-+/g, '').replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  },

  randomSlug: function () {
    var result = '';
    var length = 6;
    var characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    for (var i = length; i > 0; --i) {
      result += characters[Math.round(Math.random() * (characters.length - 1))];
    }
    return result;
  },

  getGravatar: function (email, size) {
    if (typeof size === 'undefinded') {
      size = 40;
    }
    var url
    var sizeParam = '?s=' + size;
    var dedfaulParam = '&d=mm';
    return 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email.toLowerCase().trim()).digest('hex') + '?s=' + size;
  }

}
