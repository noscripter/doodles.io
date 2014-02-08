var db = require('../db');
var utils = require('../utils');

var doodle = module.exports = {
  
  new: function (req, res, next) {
    console.log(req.body);
    // var _user = req.body._id;
    var title = req.body.title;
    var image = req.body.image;

    function justKeepTrying(possibleSlug) {
      db.doodle.existsBySlug(possibleSlug, function (err, doc) {
        if (err)
          return res.json({
            success: false,
            error: err
          });
        if (doc)
          return justKeepTrying(utils.randomSlug());
        db.doodle.add({
          title: title,
          slug: possibleSlug, // Now definite slug :)
          image: image
        }, function (err, doc) {
          if (err)
            return res.json({
              success: false,
              error: err
            });
          if (doc)
            return res.json({
              success: true,
              data: doc
            });
          return res.json({
            success: false,
            error: 'An unknown error occurred. Please try again.'
          });
        });
      });
    }

    return justKeepTrying(utils.randomSlug());
  }

}