define(['config/config_bootstrap'],
  function (config) {
    return function () {

      this.defaultOptions = function () {
        return "per_page=100&state=all&";
      };

      this.getPageParam = function (page) {
        return (isFinite(page)) ? "page=" + (page <= 0 ? 1 : page) + "&" : '';
      };

      this.authRequest = function (url) {
        return url + this.accessToken();
      };

      // TODO: put this in a common place for github_issues and repositories_urls
      this.repoIssuesURL = function (repo, page) {
        return this.authRequest(repo + '/issues?' + this.defaultOptions() + this.getPageParam(page));
      };

      this.accessToken = function () {
        return "access_token=" + this.getCurrentAuthToken();
      };

      // TODO: put this in a common place for github_issues and repositories_urls
      this.newIssueURL = function (projectName) {
        var repositoryURL = this.getURLFromProject(projectName);
        return repositoryURL.replace("api.github.com/repos", "github.com") + "/issues/new";
      };

      this.getURLFromProject = function (projectName) {
        return config.getConfig().repos[projectName] || "not found";
      };

      this.getProjectIdentifier = function (projectUrl) {

        if (projectUrl.lastIndexOf('https://api.github.com/repos/', 0) === 0) {
          return projectUrl.slice(29);
        }
        if (projectUrl.lastIndexOf('https://github.com/', 0) === 0) {
          return projectUrl.slice(19).match(/.*?\/.*?(?=\/)/)[0];
        }
      };
      this.getAllProjectsIdentifiers = function (projectNames) {
        var projectUrls = _.map(projectNames, this.getURLFromProject);

        return _.map(projectUrls, this.getProjectIdentifier);
      };
    };
  });