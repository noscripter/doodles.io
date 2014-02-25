var db = require('../db');
var library = module.exports = {

  get: function (req, res, next) {
    var username = req.params.username.toLowerCase();
    
    return db.user.getByUsername(username, function (err, doc) {
      if (err) {
        return next(err);
      }
      if (!doc) {
        // return render.notFound();
      } else {
        return db.doodle.getAllByObjectId(doc._id, function (err, docs) {
          if (err) {
            return res.json({
              success: false,
              error: err
            });
          }
          return res.render('library', {
            doodles: docs,
            user: req.user ? req.user : null
          });
        });
      }
    });
  }

}