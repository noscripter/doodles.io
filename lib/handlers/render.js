var extend = require('xtend');
var doodles = require('../../package.json');
var scripts = require('../../scripts.json');
var utils = require('../utils');
var render = module.exports = {

  render: function (req, res, next, view, params) {
    var seperator = ' | ';
    var params = params || {};
    var pageTitle = params.pageTitle ? params.pageTitle + seperator : '';
    var global = {
      production: process.env.NODE_ENV === 'production',
      version: doodles.version,
      vendor: scripts.vendor.development,
      scripts: scripts.app,
      pageTitle: pageTitle,
      user: req.user || null
    };

    if (req.user) {
      global.user.gravatar = utils.getGravatar(req.user.email);
    }

    params = extend(global, params);
    params.pageTitle = pageTitle + 'Doodles.io';

    return res.render(view, params);
  },

  doodle: function (req, res, next) {
    return render.render(req, res, next, 'doodle');
  },

  library: function (req, res, next) {
    return render.render(req, res, next, 'scrapbook');
  },

  login: function (req, res, next) {
    return req.isAuthenticated() ? res.redirect('/') : render.render(req, res, next, 'login');
  },

  register: function (req, res, next) {
    return req.isAuthenticated() ? res.redirect('/') : render.render(req, res, next, 'register');
  },

  fourOhFour: function (req, res, next) {
    return render.render(req, res, next, '404');
  }

}
