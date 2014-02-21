var mongoose = require('mongoose');
var schemas = module.exports = {

  users: mongoose.Schema({
    email: {
      type: String,
      index: {
        unique: true
      }
    },
    username: {
      type: String,
      index: {
        unique: true
      }
    },
    password: String,
    created: {
      type: Number,
      default: Date.now
    },
    modified: {
      type: Number,
      default: Date.now
    }
  }),

  doodles: mongoose.Schema({
    _user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users'
    },
    title: String,
    slug: {
      type: String,
      index: {
        unique: true
      }
    },
    image: String,
    checksum: String,
    created: {
      type: Number,
      default: Date.now
    },
    modified: {
      type: Number,
      default: Date.now
    }
  })

}