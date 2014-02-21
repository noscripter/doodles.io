var mongoose = require('mongoose');
var config = require('../config.json');
var schemas = require('./schemas');
var db = module.exports = {
  
  models: {
    users: null,
    doodles: null
  },

  init: function () {
    mongoose.connect(process.env.DATABASE_CREDENTIALS || config.database_credentials);
    var conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'Connection Error'));
    conn.once('open', function setModels() {
      db.models.users = mongoose.model('users', schemas.users);
      db.models.doodles = mongoose.model('doodles', schemas.doodles);
    });
  },

  toObjectId: function (value) {
    if (value instanceof mongoose.Types.ObjectId) {
      return value;
    }
    return new mongoose.Types.ObjectId(value);
  },

  user: {

    exists: function (query, callback) {
      db.models.users.findOne(query).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, false);
      });
    },

    getById: function (id, callback) {
      db.models.users.findOne({
        _id: id
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    getByEmail: function (email, callback) {
      db.models.users.findOne({
        email: email
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    getByUsername: function (username, callback) {
      db.models.users.findOne({
        username: username
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    add: function (params, callback) {
      var user = new db.models.users({
        email: params.email,
        username: params.username,
        password: params.password
      });
      user.save(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    }

  },

  doodle: {

    create: function (params, callback) {
      var doodle = new db.models.doodles({
        _user: params.user,
        title: params.title,
        slug: params.slug,
        image: params.image,
        checksum: params.checksum
      });
      doodle.save(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, null);
      });
    },

    get: function (slug, callback) {
      db.models.doodles.findOne({
        slug: slug
      }).exec(function (err, doc) {
        if (err) {
          return callback(err);
        }
        if (doc) {
          return callback(null, doc);
        }
        return callback(null, false);
      });
    },

    update: function (slug, data, callback) {
      db.models.doodles.update({
        slug: slug
      }, {
        $set: data
      }, {
      },
        function (err, affected) {
          if (err) {
            return callback(err);
          }
          return callback(null, affected);
        }
      );
    },

    delete: function () {

    }

  }

};
