'use strict';

requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    underscore: "underscore/underscore",
    jquery: "jquery/dist/jquery",
    jqueryUI: "jquery-ui/jquery-ui",
    tipsy: "tipsy/src/javascripts/jquery.tipsy",
    hogan: "hogan",
    blockUI: "blockui/jquery.blockUI",
    bootstrap: "components-bootstrap/js/bootstrap",
    config: '../js/config',
    component: '../js/component',
    page: '../js/page',
    clipboard: '../js/page/clipboard',
    flight: 'flight',
    'with-request': 'flight-request/lib/with_request'
  }
});

require(
  [
  'flight/lib/compose', 
	'flight/lib/registry', 
	'flight/lib/advice', 
	'flight/lib/logger', 
	'flight/lib/debug', 
	'hogan/lib/template', 
	'hogan/lib/compiler',
	'jquery', 
	'blockUI', 
	'underscore', 
	'jqueryUI', 
  'tipsy',
	'bootstrap'
  ],

  function(compose, registry, advice, withLogging, debug, $, blockUI) {
  // debug.enable(true);
  // debug.events.logAll();
    compose.mixin(registry, [advice.withAdvice]);

    require(['page/default', 'config/config_bootstrap'], function(initializeDefault, config) {
      initializeDefault();
    });
  }
);
