define(['config/config_bootstrap'],
  function (config) {
    return function () {

      this.fetchAllIssues = function (page) {
        var repos = config.getRepos();

        return _.object(_(repos).map(function (url, name) {
          var private_repo = window.location.search.slice(14) == "repo";
          var request = $.getJSON(this.repoIssuesURL(url, page));
          var hasData = $.Deferred();

          var request2 = $.ajax( {dataType: "json",
              url: this.repoIssuesURL(url,page),
              timeout: 2000
            }).
            done(function(data) {
              hasData.resolve(data);
            }).
            fail( function( xhr, status ) {
              if(xhr.status === 404 && private_repo){
               this.trigger(document, 'ui:show:messageFailConnection');
               hasData.fail();
              } else {
               hasData.resolve();
              };
            }.bind(this));

            return [name, hasData.promise() ];
          }.bind(this)));

      }


      this.defaultOptions = function () {
        return "per_page=100&state=all&";
      };

      this.getPageParam = function(page){
        return (isFinite(page)) ? "page=" + (page <= 0 ? 1 : page) + "&" : '';
      };

      this.authRequest = function (url) {
        return url + this.accessToken();
      };

      this.repoIssuesURL = function (repo, page) {
        return this.authRequest(repo + '/issues?' + this.defaultOptions() + this.getPageParam(page));
      };

      this.accessToken = function () {
        return "access_token=" + this.getCurrentAuthToken();
      };

      this.newIssueURL = function(projectName){
        var repositoryURL = this.getURLFromProject(projectName);
        return repositoryURL.replace("api.github.com/repos", "github.com") + "/issues/new";
      };

      this.getURLFromProject = function (projectName) {
        return config.getConfig().repos[projectName] || "not found";
      };

      this.getProjectIdentifier = function(projectUrl) {

        if(projectUrl.lastIndexOf('https://api.github.com/repos/',0) === 0) {
          return projectUrl.slice(29);
        }
        if(projectUrl.lastIndexOf('https://github.com/',0) === 0){
          return projectUrl.slice(19).match(/.*?\/.*?(?=\/)/)[0];
        }
      };



      this.getAllProjectsIdentifiers = function(projectNames) {
        var projectUrls = _.map(projectNames, this.getURLFromProject);

        return _.map(projectUrls,this. getProjectIdentifier);
      };
    };
  }
  );
