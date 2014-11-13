'use strict';

requirejs.config({
  baseUrl: '',
  paths: {
    'component': 'js/component',
    'page': 'js/page',
    'flight': 'bower_components/flight',
    'config': 'js/config'
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
    debug.enable(true);
    DEBUG.events.logAll();
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default', 'config/config'], function(initializeDefault, config) {
      initializeDefault();
    });
  }
);
