var session = require('./handlers/session');
var render = require('./handlers/render');
var user = require('./handlers/user');
var passport = require('passport');
var doodle = require('./handlers/doodle');
var library = require('./handlers/library');
var routes = module.exports = function (app) {

  app.get('/', function (req, res, next) {
    return res.redirect('/new');
  });

  app.get('/new', render.doodle);
  app.post('/new', doodle.create);

  app.get('/register', render.register);
  app.post('/register', user.register);

  app.get('/logout', session.logout);
  app.get('/login', render.login);
  app.post('/login', session.login);

  app.get('/:slug', doodle.get);
  app.post('/:slug', doodle.update);
  app.delete('/:slug', doodle.delete);

  app.get('/user/:username', library.get);

}