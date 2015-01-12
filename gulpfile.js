'use strict';

var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');

var devMode = process.env['NPM_CONFIG_PRODUCTION'] != 'true';

if (devMode) {
  var refresh = require('gulp-livereload');
  var livereload = require('tiny-lr');
  var server = livereload();

  gulp.task('livereload', function () {
    server.listen(35729, function (err) {
      if (err) { return console.log(err); }
    });
  });

  gulp.task('css', function () {
    gulp.src('app/**/*.css').pipe(refresh(server));
  });

  gulp.task('js', function () {
    gulp.src('app/**/*.js').pipe(refresh(server));
  });

  gulp.task('default', function () {
    gulp.run('livereload');

    gulp.watch('app/**/*.css', function (event) {
      gulp.run('css');
    });

    gulp.watch('app/**/*.js', function (event) {
      gulp.run('js');
    });
  });
}

gulp.task('rjs', function() {
  rjs({
    paths: {
      underscore: "../bower_components/underscore/underscore",
      jquery: "../bower_components/jquery/dist/jquery",
      jqueryUI: "../bower_components/jquery-ui/jquery-ui",
      tipsy: "../bower_components/tipsy/src/javascripts/jquery.tipsy",
      hogan: "../bower_components/hogan",
      flight: "../bower_components/flight",
      blockUI: "../bower_components/blockui/jquery.blockUI",
      bootstrap: "../bower_components/components-bootstrap/js/bootstrap",
      config: 'config',
      component: 'component',
      page: 'page'
    },
    shim: {
      backbone: {
        deps: ["jquery", "underscore"],
        exports: "Backbone"
      },
      bootstrap: {
        deps: ["jquery"]
      },
      jqueryUI: {
        deps: ["jquery"],
        exports: "jQuery"
      },
      underscore: {
        exports: "_"
      }
    },
    mainConfigFile : "app/js/main.js",
    baseUrl : "app/js",
    name: "main",
    out: "app/dist/main.js",
    removeCombined: true
  })
  .pipe(uglify())
  .pipe(gulp.dest('.'));
});

