describeMixin('component/mixins/repositories_urls', function () {
  beforeEach(function () {
    this.setupComponent();
  });

  describe("issues request", function(){
    it('should send access token and default options', function () {
      var repo = "https://api.github.com/repos/guipdutra/test_issues_kanboard";
      this.component.accessToken = function() { return "access_token=token666"; }

      expect(this.component.repoIssuesURL(repo)).toEqual(
        "https://api.github.com/repos/guipdutra/test_issues_kanboard/issues?per_page=100&state=all&access_token=token666");
    });
  });

  describe("repo urls ", function(){
    it('returns repo url by name', function(){
      expect(this.component.getURLFromProject("user-agent")).toEqual(
        "https://api.github.com/repos/pixelated-project/pixelated-user-agent");
      expect(this.component.getURLFromProject("dispatcher")).toEqual(
        "https://api.github.com/repos/pixelated-project/pixelated-dispatcher");
      expect(this.component.getURLFromProject("project-issues")).toEqual(
        "https://api.github.com/repos/pixelated-project/project-issues");
      expect(this.component.getURLFromProject("platform")).toEqual(
        "https://api.github.com/repos/pixelated-project/pixelated-platform");
      expect(this.component.getURLFromProject("llll")).toEqual(
        "not found");
    });
  });

  describe("new issue url", function(){
    it('returns the new issue url by project name', function(){
      this.component.getURLFromProject = function(repo){ return "https://api.github.com/repos/guipdutra/test_issues_kanboard" };

      expect(this.component.newIssueURL("user-agent")).toEqual(
        "https://github.com/guipdutra/test_issues_kanboard/issues/new"
      );
    });
  });
});
