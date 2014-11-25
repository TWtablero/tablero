define([],
  function () {
    return function () {
      this.fetchUserAgentIssues = function (page) {
        return $.getJSON(this.repoIssuesURL(this.getURLFromProject("user-agent"), page));
      };

      this.fetchDispatcherIssues = function (page) {
        return $.getJSON(this.repoIssuesURL(this.getURLFromProject("dispatcher"), page));
      };

      this.fetchPlatformIssues = function (page) {
        return $.getJSON(this.repoIssuesURL(this.getURLFromProject("platform"), page));
      };

      this.fetchProjectIssues = function (page) {
        return $.getJSON(this.repoIssuesURL(this.getURLFromProject("project-issues"), page));
      };

      this.fetchConfigInfo = function (data) {
        return $.getJSON('/config', data);
      };

      this.defaultOptions = function () {
        return "per_page=100&state=all&" 
      };

      this.getPageParam = function(page){
        return (isFinite(page)) ? "page=" + (page <= 0 ? 1 : page) + "&" : '';
      };

      this.authRequest = function (url) {
        return url + this.accessToken();
      }

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
        return CONFIG.repos[projectName] || "not found";
      };
    }
  }
);
