var extend = require('xtend');
var scripts = require('../../scripts.json');
var render = module.exports = {

  render: function (req, res, next, view, params) {
    var seperator = ' | ';
    var params = params || {};
    var pageTitle = params.pageTitle ? params.pageTitle + seperator : '';
    var global = {
      scripts: scripts.app,
      pageTitle: pageTitle,
      user: req.user || null
    };

    params = extend(global, params);
    params.pageTitle = pageTitle + 'Doodles.io';

    return res.render(view, params);
  },

  doodle: function (req, res, next) {
    return render.render(req, res, next, 'doodle');
  },

  library: function (req, res, next) {
    return render.render(req, res, next, 'library');
  },

  login: function (req, res, next) {
    return req.isAuthenticated() ? res.redirect('/') : render.render(req, res, next, 'login');
  },

  register: function (req, res, next) {
    return req.isAuthenticated() ? res.redirect('/') : render.render(req, res, next, 'register');
  }
  
}