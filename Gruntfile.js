var fs = require('fs');
var doodles = require('./package.json');
var scripts = require('./scripts.json');

module.exports = function (grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        browser: true,
        camelcase: true,
        curly: true,
        eqeqeq: true,
        expr: true,
        forin: true,
        globals: {
          'FastClick': false,
          'currentDoodle': true
        },
        indent: 2,
        noarg: true,
        quotmark: 'single',
        strict: true,
        unused: true
      },
      dist: {
        files: {
          src: scripts.app
        }
      }
    },

    uglify: {
      options: {
        banner: '/*\nDoodles.io v<%= pkg.version %>\nCopyright (c) 2014 Doodles.io (@doodlesio)\n*/\n'
      },
      dist: {
        files: {
          'public/prod/doodles.min.js': [scripts.app, scripts.vendor.production]
        }
      }
    },

    concat: {
      options: {
        stripBanners: {
          options: {
            block: true,
            line: true
          }
        }
      },
      dist: {
        src: ['public/css/vendor/*.css', 'public/css/*.less'],
        dest: 'public/prod/doodles.less'
      }
    },

    less: {
      options: {
        cleancss: true
      },
      dist: {
        files: {
          'public/prod/doodles.min.css': 'public/prod/doodles.less'
        }
      }
    },

    clean: {
      dist: {
        src: ['public/prod/doodles.less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', ['jshint', 'uglify', 'concat', 'less', 'clean']);

};
