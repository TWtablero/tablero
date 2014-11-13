define([],
  function() {
    var config;

    $.getJSON('/config', function(userData) {
        config = userData;
    });

    return config;

    function config() {
      return config;
    }

  }
);
