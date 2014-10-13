describeMixin('component/mixins/repositories_urls', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  describe("issues request", function(){
    it('should send access token and default options', function () {
      var repo = function() { return "https://api.github.com/repos/guipdutra/test_issues_kanboard" }
      this.component.accessToken = function() { return "access_token=token666"; }

      expect(this.component.repoIssuesURL(repo)).toEqual(
        "https://api.github.com/repos/guipdutra/test_issues_kanboard/issues?per_page=100&state=all&access_token=token666");
    });
  });

  describe("new issue url", function(){
    it('returns the new issue url by project name', function(){
      this.component.userAgentRepoURL = function(){ return "https://api.github.com/repos/guipdutra/test_issues_kanboard" };
      expect(this.component.newIssueURL("user-agent")).toEqual(
        "https://github.com/guipdutra/test_issues_kanboard/issues/new"
      );
    });
  });
});
