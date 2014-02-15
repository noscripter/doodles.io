var mongoose = require('mongoose'),
    config = require('./config').db;

var users = mongoose.Schema({
  email: { type: String, index: { unique: true } },
  username: { type: String, index: { unique: true } },
  password: String,
  created: { type: Number, default: Date.now },
  modified: { type: Number, default: Date.now }
});

var doodles = mongoose.Schema({
  _user: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  title: String,
  slug: String,
  image: String,
  checksum: String, // Only used for anonymous doodles.
  created: { type: Number, default: Date.now },
  modified: { type: Number, default: Date.now }
});

var db = module.exports = {

  models: {
    users: null,
    doodles: null
  },

  init: function () {
    mongoose.connect(config.credentials);
    var conn = mongoose.connection;
    conn.on('error', console.error.bind(console, 'Connection Error'));
    conn.once('open', function setModels() {
      db.models.users = mongoose.model('users', users);
      db.models.doodles = mongoose.model('doodles', doodles);
    });
  },

  toObjectId: function (value) {
    if (value instanceof mongoose.Types.ObjectId)
      return value;
    return new mongoose.Types.ObjectId(value);
  },

  user: {

    exists: function (query, callback) {
      db.models.users.findOne(query)
      .exec(function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, false);
      });
    },

    getById: function (id, callback) {
      db.models.users.findOne({ _id: id })
      .exec(function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, null);
      });
    },

    getByEmail: function (email, callback) {
      db.models.users.findOne({ email: email })
      .exec(function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, null);
      });
    },

    getByUsername: function (username, callback) {
      db.models.users.findOne({ username: username })
      .exec(function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
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
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, null);
      });
    }

  },

  doodle: {

    getBySlug: function (slug, callback) {
      db.models.doodles.findOne({ slug: slug })
      .exec(function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, false);
      });
    },

    add: function (params, callback) {
      var doodle = new db.models.doodles({
        title: params.title,
        slug: params.slug,
        image: params.image,
        checksum: params.checksum
      });
      doodle.save(function (err, doc) {
        if (err)
          return callback(err);
        if (doc)
          return callback(null, doc);
        return callback(null, null);
      });
    },

    updateBySlug: function (slug, data, callback) {
      db.models.doodles.update(
        { slug: slug },
        { $set: data },
        {},
        function (err, affected) {
          if (err)
            return callback(err);
          return callback(null, affected);
        }
      );
    }

  }

};