var express  = require('express'),
    app = express(),
    passport = require('passport'),
    hbs = require('express-hbs')
    routes = require('./routes'),
    db = require('./db'),
    session = require('./handlers/session'),
    config = require('./config'),
    port = process.env.PORT || config.port || 3000;

process.env.NODE_ENV = config.env || process.env.NODE_ENV || 'development';

app.connect = function () {

  app.set('version', require('../package').version);
  app.set('views', __dirname + '/../views');
  app.engine('hbs', hbs.express3());
  app.set('view engine', 'hbs');

  app.use(express.compress());
  app.use(express.cookieParser(app.set('8702136dc762c2c0998acb4dc999bb78')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieSession({
    key: 'doodles',
    secret: '8702136dc762c2c0998acb4dc999bb78',
    maxAge: 86400000
  }));
  app.use(passport.initialize());
  app.use(passport.session({
    secret: '8702136dc762c2c0998acb4dc999bb78'
  }));
  app.use('/public', express.static(__dirname + '/../public', {
    maxAge: 86400000
  }));

  app.use(app.router);

  app.use(function (err, req, res, next) {
    console.log(err.stack);
    res.json(err.stack);
  });

  session.init();

  db.init();

  routes(app);

  module.exports.listen(port);
  console.log('Doodles.io v' + app.get('version') + ' is up and running on port ' + port + '.');

};

module.exports = app;

if (require.main === module) {
  app.connect();
}