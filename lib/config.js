var fs = require('fs');
var config = require('../config.default.json');
var extend = require('xtend');

if (fs.existsSync('config.json')) {
  config = extend(config, require('../config.json'));
}

module.exports = config;