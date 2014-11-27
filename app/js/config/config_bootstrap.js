define([],
  function () {
    var config;

    $.getJSON('/config', function (data) {
      config = data;
    });

    return {
      getConfig: function () {
        return config;
      }
    }

  }
);