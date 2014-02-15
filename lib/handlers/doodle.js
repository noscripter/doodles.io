var db = require('../db');
var utils = require('../utils');
var crypto = require('crypto');

var doodle = module.exports = {
  
  new: function (req, res, next) {
    // var _user = req.body._id;
    var title = req.body.title;
    var image = req.body.image;
    var checksum = crypto.createHash('sha256').digest("hex"); // WHEN USERS ARE IMPLEMENTED, DON'T GENERATE IF IT'S NOT ANONYMOUS

    function justKeepTrying(possibleSlug) {
      db.doodle.existsBySlug(possibleSlug, function (err, doc) {
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
    db.doodle.existsBySlug(req.params.slug, function (err, doc) {
      if (err)
        return next();
      if (doc)
        return res.render('doodle', {
          doodle: doc
        });
      return next();
    });
  },

  update: function (req, res, next) {
    var data = {
      title: req.body.title,
      image: req.body.image
    };
    db.doodle.updateBySlug(req.params.slug, data, function (err, affected) {
      if (err)
        return res.json({
          success: false,
          error: err
        });
      if (affected)
        return res.json({
          success: true,
          affected: affected
        });
      return res.json({
        success: false,
        error: 'An unknown error occurred. Please try again.'
      });
    });
  }

}