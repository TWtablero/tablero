'use strict';

var gulp = require('gulp');
var rjs = require('gulp-requirejs');
var uglify = require('gulp-uglify');

gulp.task('rjs', function() {
    rjs({
      paths: {
        underscore: "../bower_components/underscore/underscore",
        jquery: "../bower_components/jquery/dist/jquery",
        jqueryUI: "../bower_components/jquery-ui/jquery-ui",
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

gulp.task('default', function () {
  gulp.run('rjs');
  
});
