'use strict';

requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    'config': '../js/config',
    'component': '../js/component',
    'page': '../js/page',
    'flight': '../bower_components/flight'
  }
});


require(
  [
    'flight/lib/compose',
    'flight/lib/registry',
    'flight/lib/advice',
    'flight/lib/logger',
    'flight/lib/debug'
  ],

  function(compose, registry, advice, withLogging, debug) {
  // debug.enable(true);
  // DEBUG.events.logAll();
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default', 'config/config_bootstrap'], function(initializeDefault, config) {
      initializeDefault();
    });
  }
);
