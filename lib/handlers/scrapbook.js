var db = require('../db');
var render = require('./render');
var scrapbook = module.exports = {

  get: function (req, res, next) {
    var username = req.params.username;

    return db.user.getByUsername(username, function (err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        return next();
      } else {
        return db.doodle.getAllByObjectId(doc._id, function (err, docs) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          return render.render(req, res, next, 'scrapbook', {
            doodles: docs,
            userIsOwner: req.isAuthenticated() ? req.user.username === req.params.username : false
          });
        });
      }
    });
  },

  getAll: function (req, res, next) {
    return db.doodle.getAll(function (err, docs) {
      if (err) {
        return next(err);
      }
      if (!docs) {
        return next();
      } else {
        return render.render(req, res, next, 'scrapbook_all', {
          doodles: docs
        });
      }
    });
  }

}
