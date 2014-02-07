var session = require('./handlers/session');

module.exports = function (app) {

  app.get('/', session.ensureAuthenticated, function (req, res, next) {
    return res.render('index');
  });

  app.get('/admin/logout', session.logout);
  app.get('/admin/login', render.login);
  app.post('/admin/login', passport.authenticate('local', {
    successRedirect: '/admin/content',
    failureRedirect: '/admin/login'
  }));

}