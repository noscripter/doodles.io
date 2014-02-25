var db = require('../db');
var utils = require('../utils');
var crypto = require('crypto');
var render = require('./render');
var doodle = module.exports = {
  
  create: function (req, res, next) {
    var user = req.isAuthenticated() ? req.user._id : null;
    var title = req.body.title;
    var image = req.body.image;
    var hash = crypto.createHash('sha256').update(Date.now().toString()).digest("hex");
    var checksum = !req.isAuthenticated() ? hash : null;
    var parent = req.body.parent || null;

    function slug(slug) {
      return db.doodle.get(slug, function (err, doc) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        if (doc) {
          return slug(utils.randomSlug());
        }
        return db.doodle.create({
          user: user,
          title: title,
          slug: slug,
          image: image,
          checksum: checksum,
          parent: parent
        }, function (err, doc) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          if (doc) {
            if (doc._user) {
              return res.json({
                success: true,
                data: {
                  slug: doc.slug
                }
              });
            }
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

    return slug(utils.randomSlug());
  },

  get: function (req, res, next) {
    db.doodle.get(req.params.slug, function (err, doc) {
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
      return db.doodle.get(req.params.slug, function (err, doc) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        if (doc) {
          if (doc._user) {
            if (req.user._id.toString() === doc._user.toString()) {
              return updatePermitted(req, res, next, data);
            } else {
              return doodle.create(req, res, next);
            }
          } else {
            return doodle.create(req, res, next);
          }
        }
        return res.json({
          success: false,
          error: 'An unknown error occurred. Please try again.'
        });
      });
    } else {
      if (data.checksum) {
        return db.doodle.get(req.params.slug, function (err, doc) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          if (doc) {
            if (data.checksum !== doc.checksum) {
              return doodle.create(req, res, next);
            }
            return updatePermitted(req, res, next, data);
          }
          return res.json({
            success: false,
            error: 'An unknown error occurred. Please try again.'
          });
        });
      } else {
        return doodle.create(req, res, next);
      }
    }

    function updatePermitted(req, res, next, data) {
      return db.doodle.update(req.params.slug, data, function (err, affected) {
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
  },

  delete: function (req, res, next) {
    if (req.isAuthenticated()) {
      return db.doodle.get(req.params.slug, function (err, doc) {
        if (err) {
          return res.json({
            success: false,
            error: err
          });
        }
        if (doc) {
          if (doc._user) {
            if (req.user._id.toString() === doc._user.toString()) {
              return deletePermitted(req, res, next);
            }
          }
          return res.json({
            success: false,
            error: 'You do not have permission to make this delete request.'
          })
        }
        return res.json({
          success: false,
          error: 'An unknown error occurred. Please try again.'
        });
      });
    } else {
      return res.json({
        success: false,
        error: 'You must be logged in to make a delete request.'
      });
    }

    function deletePermitted (req, res, next) {
      return db.doodle.delete(req.params.slug, function (err) {
        if (err) {
          return res.json({
            success: false,
            error: err
          })
        }
        return res.json({
          success: true
        })
      });
    }
  }

}