define(['config/config_bootstrap'],
  function (config) {
    return function () {

      this.fetchAllIssues = function (page, blockedRepos) {
        var repos = config.getRepos();
        _.each( Object.keys(repos), function(val){
          if(_.contains(blockedRepos,val)){
            delete repos[val];
          }
        });



        return _.object(_(repos).map(function (url, name) {
            var request = $.getJSON(this.repoIssuesURL(url, page));
            request.fail(function(){
              $(document).trigger('ui:issues:hidePrivateRepos', { repos : [name]});              
              console.log('fail to get project '+name);
            });
            return [name,request ];
        }.bind(this)));

      };

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
    }
  }
  );
