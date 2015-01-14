define([],
  function () {
    var config = { repos : [] , labels : [] } ;
    
    $.getJSON('/config', function (data) {
      config = data || { repos : [] , labels : [] } ;
    });

    return {
      getConfig: function () {
        return config;
      },
      getRepos: function() {
        return config.repos
      },
      getReposNames: function() {
        return Object.keys(config.repos);
      },
      getLabels: function() {
        return config.labels;
      }
    }

  }
);
