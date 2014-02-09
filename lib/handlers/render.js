var extend = require('xtend');

var render = module.exports = {
  render: function (req, res, next, view, params) {
    var seperator = ' | ',
        params = params || {},
        pageTitle = params.pageTitle ? params.pageTitle + seperator : '';

    var global = {
      pageTitle: pageTitle,
      user: req.user || null // Eventually normalize this.
    };

    // Extend global parameters with values passed in.
    params = extend(global, params);

    // Handles page titles.
    params.pageTitle = pageTitle + 'Doodles.io';

    return res.render(view, params);
  },

  newDoodle: function (req, res, next) {
    return render.render(req, res, next, 'doodle');
  },

  login: function (req, res, next) {
    return render.render(req, res, next, 'login');
  },

  register: function (req, res, next) {
    return render.render(req, res, next, 'register');
  }
}