define([
		'config/config_bootstrap'
	],
  function (configBootstrap) {
    return function () {
      this.getCurrentAuthToken = function () {
        return window.location.hash.slice(1) || configBootstrap.getReadOnlyAccessToken();
      };

      this.getURLToken = function() {
        return window.location.hash.slice(1);
      };

      this.usingUserAuthToken = function(){
      	return !!window.location.hash.slice(1);
      };
    }
  }
);
