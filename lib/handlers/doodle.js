var db = require('../db');
var utils = require('../utils');
var crypto = require('crypto');
var render = require('./render');

var doodle = module.exports = {
  
  new: function (req, res, next) {
    // var _user = req.body._id;
    // Test to see if user is logged in (or passed), if so, add user to data, if not then null
    var title = req.body.title;
    var image = req.body.image;
    var checksum = crypto.createHash('sha256').update(Date.now().toString()).digest("hex"); // WHEN USERS ARE IMPLEMENTED, DON'T GENERATE IF IT'S NOT ANONYMOUS

    function justKeepTrying(possibleSlug) {
      return db.doodle.getBySlug(possibleSlug, function (err, doc) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        if (doc) {
          return justKeepTrying(utils.randomSlug());
        }
        return db.doodle.add({
          user: req.isAuthenticated() ? req.user._id : null,
          title: title,
          slug: possibleSlug, // Now definite slug :)
          image: image,
          checksum: checksum
        }, function (err, doc) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          if (doc) {
            return res.json({
              success: true,
              data: {
                slug: doc.slug,
                checksum: doc.checksum
              }
            });
          }
          return res.json({
            success: false,
            error: 'An unknown error occurred. Please try again.'
          });
        });
      });
    }

    return justKeepTrying(utils.randomSlug());
  },

  get: function (req, res, next) {
    db.doodle.getBySlug(req.params.slug, function (err, doc) {
      if (err) {
        return next();
      }
      if (doc) {
        return res.render('doodle', {
          doodle: doc,
          user: req.user ? req.user : null
        });
      }
      return next();
    });
  },

  update: function (req, res, next) {
    var data = {
      title: req.body.title,
      image: req.body.image,
      checksum: req.body.checksum
    };

    if (req.isAuthenticated()) {
      // The user's logged in
      return db.doodle.getBySlug(req.params.slug, function (err, doc) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        if (doc) {
          if (req.user._id.toString() === doc._user.toString()) {
            return doodle.updatePermitted(req, res, next, data);
          } else {
            return doodle.new(req, res, next);
          }
        }
        return res.json({
          success: false,
          error: 'An unknown error occurred. Please try again.'
        });
      });
    } else {
      // Anonymous edit
      if (data.checksum) {
        return db.doodle.getBySlug(req.params.slug, function (err, doc) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          if (doc) {
            if (data.checksum !== doc.checksum) {
              // Checksum doesn't match the doodle's checksum, therefore ANONYMOUS FORK
              return doodle.new(req, res, next);
            }
            return doodle.updatePermitted(req, res, next, data);
          }
          return res.json({
            success: false,
            error: 'An unknown error occurred. Please try again.'
          });
        });
      } else {
        return doodle.new(req, res, next);
      }
    }
  },

  updatePermitted: function (req, res, next, data) {
    return db.doodle.updateBySlug(req.params.slug, data, function (err, affected) {
      if (err) {
        return res.json({
          success: false,
          error: err
        });
      }
      if (affected) {
        return res.json({
          success: true,
          affected: affected
        });
      }
      return res.json({
        success: false,
        error: 'An unknown error occurred. Please try again.'
      });
    });
  }

}